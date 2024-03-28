const { test, expect } = require('@playwright/test');

// Page Object for Selectors
const SELECTORS = {
    GENERAL_NAV: "[data-testid='general-nav']",
    DROPDOWN_MENU: "#dropdownMenu",
    SERVICES_NAV: "//a[@data-testid='services-nav']/span", 
};

let page;

// Helper function to click on an element by locator
async function clickElement(locator) {
    try {
        await page.locator(locator).click();
    } catch (error) {
        logError("Error while clicking element", error);
    }
}

// Helper function to wait for navigation
async function waitForNavigation() {
    await page.waitForNavigation();
}

// Helper function to wait for an element by locator
async function waitForElement(selector, options) {
    await page.waitForSelector(selector, options);
}

// Helper function to fill an input field
async function fillInputField(selector, value) {
    await page.locator(selector).fill(value);
}

// Helper function to log errors
function logError(message, error) {
    console.error(`${message}: ${error}`);
}
// Helper function to click on a dropdown menu and select a language
async function changeLanguage(language) {
    try {
        await clickElement(SELECTORS.DROPDOWN_MENU);
        await clickElement(`ul.awd-dropdown-list.dropdownOptions li[data-testid="language_${language}"]`);
        await clickElement("[aria-label='Save.']");
    } catch (error) {
        logError("Error while changing language", error);
    }
}

// Helper function to navigate to settings and click on General
async function goToGeneralSettings() {
    try {
        await clickElement("#sidebar-app-settings");
        await clickElement(SELECTORS.GENERAL_NAV);
    } catch (error) {
        logError("Error while navigating to settings", error);
    }
}

// test.beforeAll('Setup-Setmore Login', async ({ browser }) => {
test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("https://go.setmore.com");
    await fillInputField(".email-field", "generaltest@setmore.com");
    await fillInputField(".password-field", "123setmore");
    await clickElement("#login-now")
    await waitForElement("//a[@id='sidebar-app-settings']/*[name()='svg']", { visible: true });
    await expect(page).toHaveTitle("General's Calendar");
});

test.afterEach(async () => {
    await page.close();
});

test.describe('Language Settings', async () => {

    test('Test case 1 : Verify English (US) is the default language', async () => {
        await goToGeneralSettings();
        await expect(page.locator(SELECTORS.DROPDOWN_MENU)).toContainText("English (US)", "Default language is not English (US)");
    });

    test('Test case 2 : Change Preferred language from English US to Spanish', async () => {
        await goToGeneralSettings();
        await changeLanguage("Spanish");
        await expect(page.locator("[class='awd-modal-body']")).toContainText("The default language of your app will change from English (US) to Spanish", "Language change confirmation message not found");
        await clickElement("[data-testid='change-language-button']");
        //console.log(await page.locator("//div[@class='awd-snackbar no-text-truncate']").textContent());//Language updated snackbar
        await waitForNavigation();
        await waitForElement("#dropdownMenuDescription", { visible: true });
        await expect(page.locator(SELECTORS.DROPDOWN_MENU)).toContainText("Spanish", "Selected language not changed to Spanish");
        await page.waitForSelector(SELECTORS.SERVICES_NAV, { visible: true });
        await expect(page.locator(SELECTORS.SERVICES_NAV)).toContainText("Servicios", "Services text not found in Spanish");
        await expect(page.locator(SELECTORS.GENERAL_NAV)).toContainText("General", "General navigation item not found");
    });

    test('Test case 3 : Change Preferred language from Spanish to English UK', async () => {
        await goToGeneralSettings();
        await expect(page.locator(SELECTORS.DROPDOWN_MENU)).toContainText("Spanish");
        await changeLanguage("English (UK)");
        await expect(page.locator("[class='awd-modal-body']")).toContainText("El idioma predeterminado de tu aplicación cambiará de Spanish a English (UK)", "Language change confirmation message not found");
        await clickElement("[data-testid='change-language-button']");
        await waitForNavigation();
        await waitForElement("#dropdownMenuDescription", { visible: true });
        await expect(page.locator(SELECTORS.DROPDOWN_MENU)).toContainText("English (UK)", "Selected language not changed to English (UK)");
        await waitForElement(SELECTORS.SERVICES_NAV, { visible: true });
        await expect(page.locator(SELECTORS.SERVICES_NAV)).toContainText("Services", "Services text not found in English (UK)");
        await expect(page.locator(SELECTORS.GENERAL_NAV)).toContainText("General", "General navigation item not found");
    });

    test('Test case 4 : Change Preferred language from English UK to Portuguese', async () => {
        await goToGeneralSettings();
        await expect(page.locator(SELECTORS.DROPDOWN_MENU)).toContainText("English (UK)");
        await changeLanguage("Portuguese");
        await expect(page.locator("[class='awd-modal-body']")).toContainText("The default language of your app will change from English (UK) to Portuguese", "Language change confirmation message not found");
        await clickElement("[data-testid='change-language-button']");
        await waitForNavigation();
        await waitForElement("#dropdownMenuDescription", { visible: true });
        await expect(page.locator(SELECTORS.DROPDOWN_MENU)).toContainText("Portuguese", "Selected language not changed to Portuguese");
        await waitForElement(SELECTORS.SERVICES_NAV, { visible: true });
        await expect(page.locator(SELECTORS.SERVICES_NAV)).toContainText("Serviços", "Services text not found in Portuguese");
        await expect(page.locator(SELECTORS.GENERAL_NAV)).toContainText("Geral", "Geral navigation item not found");
    });

    test('Test case 5 : Change Preferred language from Portuguese to English US', async () => {
        await goToGeneralSettings();
        await expect(page.locator(SELECTORS.DROPDOWN_MENU)).toContainText("Portuguese");
        await changeLanguage("English (US)");
        await expect(page.locator("[class='awd-modal-body']")).toContainText("A língua padrão do app mudará de Portuguese para English (US)", "Language change confirmation message not found");
        await clickElement("[data-testid='change-language-button']");
        await waitForNavigation();
        await waitForElement("#dropdownMenuDescription", { visible: true });
        await expect(page.locator(SELECTORS.DROPDOWN_MENU)).toContainText("English (US)", "Selected language not changed to English (US)");
        await waitForElement(SELECTORS.SERVICES_NAV, { visible: true });
        await expect(page.locator(SELECTORS.SERVICES_NAV)).toContainText("Services", "Services text not found in English (US)");
        await expect(page.locator(SELECTORS.GENERAL_NAV)).toContainText("General", "General navigation item not found");
    });
});