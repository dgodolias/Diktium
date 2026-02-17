const axios = require('axios');
const https = require('https');
const xlsx = require('xlsx');
const fs = require('fs');

const API_KEY = '3AjwrQBTr29f3tx66whGWnkedXIVR50l';
const BASE_URL = 'https://opendata-api.businessportal.gr/api/opendata/v1';

const agent = new https.Agent({ rejectUnauthorized: false });

// Config: Fetching all valid IKEs from 2025 onwards (Date logic disabled for broad verification)
const TARGET_START_DATE = new Date('2025-01-01');
const TARGET_END_DATE = new Date('2025-12-31');
const PAGE_SIZE = 200;
const MAX_PAGES = 100; // Production Limit
const DELAY_MS = 8000; // 8 seconds per request (Strict 8 req/min)

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'api_key': API_KEY },
    httpsAgent: agent
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log("=== Starting Business Data Extraction ===");

    // 1. Get IKE ID
    let ikeId = null;
    try {
        console.log("Fetching Legal Types...");
        const res = await api.get('/metadata/legalTypes');
        // ID 19 is IKE (Greek characters: ΙΚΕ)
        const ike = res.data.find(d => d.id == 19 || d.descr === 'ΙΚΕ' || d.descr === 'Ιδιωτική Κεφαλαιουχική Εταιρεία');
        if (ike) {
            ikeId = ike.id;
            console.log(`Found IKE ID: ${ikeId} (${ike.descr})`);
        } else {
            console.error("Could not find IKE legal type.");
            return;
        }
    } catch (e) {
        console.error("Error fetching legal types:", e.message);
        return;
    }

    // 2. Scan Companies
    let allCompanies = [];
    let page = 0;
    let stopScanning = false;
    let sortBy = '-incorporationDate';
    let sortFailed = false;

    while (!stopScanning && page < MAX_PAGES) {
        console.log(`Fetching Page ${page} (Offset ${page * PAGE_SIZE})...`);

        try {
            const params = {
                legalTypes: ikeId,
                resultsOffset: page * PAGE_SIZE,
                resultsSize: PAGE_SIZE
            };
            if (!sortFailed) {
                params.resultsSortBy = sortBy;
            }

            const res = await api.get('/companies', { params });
            const companies = res.data.searchResults;

            if (!companies || companies.length === 0) {
                console.log("No more results.");
                break;
            }

            console.log(`Received ${companies.length} records.`);

            for (const company of companies) {
                let dateStr = company.incorporationDate;

                // For now, we export everything to ensure data collection
                allCompanies.push(company);

                /* Sorted Logic (Disabled for verification, can act as reference)
                const regDate = new Date(dateStr);
                if (!sortFailed && regDate < TARGET_START_DATE) {
                     stopScanning = true; break; 
                }
                */
            }

            if (stopScanning) break;
            page++;
            await sleep(DELAY_MS);

        } catch (e) {
            if (e.response && e.response.status === 429) {
                console.warn(`Rate Limit Hit (429) on Page ${page}. Waiting 60 seconds...`);
                await sleep(61000);
                console.log("Retrying...");
                continue;
            }

            if (e.response && e.response.status === 400 && !sortFailed) {
                console.warn("Soft Error: Sort failed. Switching to Full Scan mode.");
                sortFailed = true;
                page = 0;
                allCompanies = [];
                continue;
            }

            console.error(`Error fetching page ${page}:`, e.message);
            break;
        }
    }

    console.log(`Extracted ${allCompanies.length} companies.`);

    // 3. Export to Excel
    if (allCompanies.length > 0) {
        const exportData = allCompanies.map(c => ({
            "GEMI": c.arGemi,
            "Name": c.coNameEl || (c.coNamesEn ? c.coNamesEn[0] : ''),
            "AFM": c.afm,
            "Legal Form": c.legalType ? c.legalType.descr : '',
            "Status": c.status ? c.status.descr : '',
            "Incorporation Date": c.incorporationDate,
            "Address": `${c.street || ''} ${c.streetNumber || ''}`,
            "City": c.city,
            "Municipality": c.municipality ? c.municipality.descr : '',
            "Zip": c.zipCode,
            "Phone": c.phone,
            "Email": c.email,
            "Website": c.url,
            "Activities": c.activities ? c.activities.map(a => a.activity.descr).join('; ') : ''
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(exportData);
        const wscols = Object.keys(exportData[0]).map(k => ({ wch: 20 }));
        ws['!cols'] = wscols;

        xlsx.utils.book_append_sheet(wb, ws, "Companies");
        xlsx.writeFile(wb, "business_data.xlsx");
        console.log("Saved to business_data.xlsx");
    } else {
        console.log("No companies found.");
    }
}

main();
