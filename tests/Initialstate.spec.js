const { test, expect } = require('@playwright/test');

// Page Object for Selectors
const Selectors = {
    GeneralNav: "[data-testid='general-nav']",
    DropdownMenu: "#dropdownMenu",
    ServicesNav: "//a[@data-testid='services-nav']/span",
};

let page;

// Helper function to click on a dropdown menu and select a language
async function changeLanguage(language) {
    try {
        await page.locator(Selectors.DropdownMenu).click();
        await page.locator(`ul.awd-dropdown-list.dropdownOptions li[data-testid="language_${language}"]`).click();
        await page.locator("[aria-label='Save.']").click();
    } catch (error) {
        console.error(`Error while changing language: ${error}`);
    }
}

// Helper function to navigate to settings and click on General
async function goToGeneralSettings() {
    try {
        await page.locator("#sidebar-app-settings").click();
        await page.locator(Selectors.GeneralNav).click();
    } catch (error) {
        console.error(`Error while navigating to settings: ${error}`);
    }
}

// test.beforeAll('Setup-Setmore Login', async ({ browser }) => {
test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("https://go.setmore.com");
    await page.locator(".email-field").fill("generaltest@setmore.com");
    await page.locator(".password-field").fill("123setmore");
    await page.locator("#login-now").click();
    await page.waitForSelector("//a[@id='sidebar-app-settings']/*[name()='svg']", { visible: true });
    await expect(page).toHaveTitle("General's Calendar");
});

test.afterEach(async () => {
    await page.close();
});

test.describe('Language Settings', async () => {

    test('Test case 1 : Verify English (US) is the default language', async () => {
        await goToGeneralSettings();
        await expect(page.locator(Selectors.DropdownMenu)).toContainText("English (US)", "Default language is not English (US)");
    });

    test('Test case 2 : Change Preferred language from English US to Spanish', async () => {
        await goToGeneralSettings();
        await changeLanguage("Spanish");
        await expect(page.locator("[class='awd-modal-body']")).toContainText("The default language of your app will change from English (US) to Spanish", "Language change confirmation message not found");
        await page.locator("[data-testid='change-language-button']").click();
        //console.log(await page.locator("//div[@class='awd-snackbar no-text-truncate']").textContent());//Language updated snackbar
        await page.waitForNavigation();
        await page.waitForSelector("#dropdownMenuDescription", { visible: true });
        await expect(page.locator(Selectors.DropdownMenu)).toContainText("Spanish", "Selected language not changed to Spanish");
        await page.waitForSelector(Selectors.ServicesNav, { visible: true });
        await expect(page.locator(Selectors.ServicesNav)).toContainText("Servicios", "Services text not found in Spanish");
        await expect(page.locator(Selectors.GeneralNav)).toContainText("General", "General navigation item not found");
    });

    test('Test case 3 : Change Preferred language from Spanish to English UK', async () => {
        await goToGeneralSettings();
        await expect(page.locator(Selectors.DropdownMenu)).toContainText("Spanish");
        await changeLanguage("English (UK)");
        await expect(page.locator("[class='awd-modal-body']")).toContainText("El idioma predeterminado de tu aplicación cambiará de Spanish a English (UK)", "Language change confirmation message not found");
        await page.locator("[data-testid='change-language-button']").click();
        await page.waitForNavigation();
        await page.waitForSelector("#dropdownMenuDescription", { visible: true });
        await expect(page.locator(Selectors.DropdownMenu)).toContainText("English (UK)", "Selected language not changed to English (UK)");
        await page.waitForSelector(Selectors.ServicesNav, { visible: true });
        await expect(page.locator(Selectors.ServicesNav)).toContainText("Services", "Services text not found in English (UK)");
        await expect(page.locator(Selectors.GeneralNav)).toContainText("General", "General navigation item not found");
    });

    test('Test case 4 : Change Preferred language from English UK to Portuguese', async () => {
        await goToGeneralSettings();
        await expect(page.locator(Selectors.DropdownMenu)).toContainText("English (UK)");
        await changeLanguage("Portuguese");
        await expect(page.locator("[class='awd-modal-body']")).toContainText("The default language of your app will change from English (UK) to Portuguese", "Language change confirmation message not found");
        await page.locator("[data-testid='change-language-button']").click();
        await page.waitForNavigation();
        await page.waitForSelector("#dropdownMenuDescription", { visible: true });
        await expect(page.locator(Selectors.DropdownMenu)).toContainText("Portuguese", "Selected language not changed to Portuguese");
        await page.waitForSelector(Selectors.ServicesNav, { visible: true });
        await expect(page.locator(Selectors.ServicesNav)).toContainText("Serviços", "Services text not found in Portuguese");
        await expect(page.locator(Selectors.GeneralNav)).toContainText("Geral", "Geral navigation item not found");
    });

    test('Test case 5 : Change Preferred language from Portuguese to English US', async () => {
        await goToGeneralSettings();
        await expect(page.locator(Selectors.DropdownMenu)).toContainText("Portuguese");
        await changeLanguage("English (US)");
        await expect(page.locator("[class='awd-modal-body']")).toContainText("A língua padrão do app mudará de Portuguese para English (US)", "Language change confirmation message not found");
        await page.locator("[data-testid='change-language-button']").click();
        await page.waitForNavigation();
        await page.waitForSelector("#dropdownMenuDescription", { visible: true });
        await expect(page.locator(Selectors.DropdownMenu)).toContainText("English (US)", "Selected language not changed to English (US)");
        await page.waitForSelector(Selectors.ServicesNav, { visible: true });
        await expect(page.locator(Selectors.ServicesNav)).toContainText("Services", "Services text not found in English (US)");
        await expect(page.locator(Selectors.GeneralNav)).toContainText("General", "General navigation item not found");
    });
});