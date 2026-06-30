declare module "selenium-webdriver";
declare module "selenium-webdriver/edge";
import { Builder, By, until, WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/edge";

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clickElement(driver: WebDriver, element: any): Promise<void> {
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
    await driver.wait(until.elementIsVisible(element), 1000);
    await driver.wait(until.elementIsEnabled(element), 1000);

    try {
        await element.click();
    } catch (error) {
        await driver.executeScript("arguments[0].click();", element);
    }
}

async function main(): Promise<void> {
    const options = new Options();
    options.addArguments("--start-maximized");
    options.setPageLoadStrategy("normal");

    const driver: WebDriver = await new Builder()
        .forBrowser("MicrosoftEdge")
        .setEdgeOptions(options)
        .build();

    try {
        await driver.get("https://www.saucedemo.com/");
        console.log("Website opened");

        await sleep(2000);

        const username = await driver.wait(until.elementLocated(By.id("user-name")), 1000);
        await driver.wait(until.elementIsVisible(username), 1000);
        await username.sendKeys("standard_user");

        const password = await driver.findElement(By.id("password"));
        await password.sendKeys("secret_sauce");

        const loginButton = await driver.findElement(By.id("login-button"));
        await loginButton.click();
        console.log("Login successful");

        await sleep(3000);

        await driver.wait(until.elementLocated(By.id("inventory_container")), 10000);

        const menuButton = await driver.findElement(By.id("react-burger-menu-btn"));
        await driver.wait(until.elementIsVisible(menuButton), 1000);
        await driver.wait(until.elementIsEnabled(menuButton), 1000);
        await menuButton.click();
        console.log("Menu opened");

        await sleep(2000);

        const aboutLink = await driver.wait(until.elementLocated(By.xpath('//*[@id="about_sidebar_link"]')), 10000);
        await clickElement(driver, aboutLink);
        console.log("Clicked About");

        await sleep(2000);

        const targetXPath = '//*[@id="__next"]/div[4]/div[3]/div/div[2]/div/div/div[2]/div/div/div[1]/div[2]/button[7]';
        const target = await driver.wait(until.elementLocated(By.xpath(targetXPath)), 10000);
        await clickElement(driver, target);
        console.log("Clicked target button");

        await sleep(2000);
        console.log("Test Passed Successfully");
    } catch (error) {
        console.log(`Test Failed: ${error}`);
    } finally {
        await driver.quit();
        console.log("Browser closed");
    }
}

main().catch((error) => console.error(error));
