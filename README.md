## SALXVRON TOOLS
![Alt Text](https://k.top4top.io/p_3370zuc3a0.png)

## SQLi injection scanner
This function scans a given website URL for SQL Injection vulnerabilities.

It tests various SQL payloads to check if the database returns errors, indicating a possible vulnerability.

If the website is found to be vulnerable, it displays a warning message.

command 

```node salxvron.js https://example.com/product.php?id=1 sqli```

## DDoS Attack

This feature simulates a stress test on a website to analyze its resistance to high traffic loads.

It sends a large number of requests to the target website using proxy servers.

If a proxy is blocked, it automatically switches to another one to continue the attack.

command

``` node salxvron.js example.com ddos ```

## Run Command
For update package If it’s already installed, you don’t need to install it again

```pkg update && pkg upgrade ```

For git installation If it’s already installed, you don’t need to install it again

```pkg install git```

For nodejs installation If it’s already installed, you don’t need to install it again

```pkg install nodejs```

For npm installation If it’s already installed, you don’t need to install it again

```pkg install npm```

Direct to script

```sh
git clone https://github.com/SalvadorXploitiji/salxvron
cd salxvron
unzip salxvron.zip
node salxvron.js <url> <features>
```

