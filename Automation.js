describe("OrangeHRM User Management Flow", () => {

    const adminUser = "Admin";
    const adminPass = "admin123";

    const createdUser = {
        role: "ESS",
        employeeName: "Paul Collings",
        username: "autoUser_" + Date.now(),
        password: "Test@12345"
    };

    const updatedUserRole = "Admin"; // For editing

    it("Login into OrangeHRM", async () => {
        await browser.url("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

        await $("//input[@name='username']").setValue(adminUser);
        await $("//input[@name='password']").setValue(adminPass);
        await $("//button[@type='submit']").click();

        await expect($("//h6[text()='Dashboard']")).toBeDisplayed();
    });

    it("Navigate to Admin Module", async () => {
        await $("//span[text()='Admin']").click();
        await expect($("//h6[text()='Admin']")).toBeDisplayed();
    });

    it("Add New User", async () => {
        await $("button[data-v-10d463b7]").click(); // Add button

        // Select User Role
        await $("//label[text()='User Role']/../..//div[@class='oxd-select-text-input']").click();
        await $("//span[text()='" + createdUser.role + "']").click();

        // Enter Employee Name
        await $("input[placeholder='Type for hints...']").setValue(createdUser.employeeName);
        await $("div[role='option']").click();

        // Username
        await $("//label[text()='Username']/../..//input").setValue(createdUser.username);

        // Status = Enabled
        await $("//label[text()='Status']/../..//div[@class='oxd-select-text-input']").click();
        await $("//span[text()='Enabled']").click();

        // Password
        await $("//label[text()='Password']/../..//input").setValue(createdUser.password);

        // Confirm Password
        await $("//label[text()='Confirm Password']/../..//input").setValue(createdUser.password);

        // Save
        await $("button[type='submit']").click();

        await browser.pause(2000);
    });

    it("Search Newly Created User", async () => {
        // Username
        await $("//label[text()='Username']/../..//input").setValue(createdUser.username);

        // Click Search
        await $("button[type='submit']").click();
        await browser.pause(2000);

        // Validate user appears in table
        const tableText = await $("div.oxd-table-card").getText();
        expect(tableText).toContain(createdUser.username);
    });

    it("Edit User Details", async () => {
        // Click Edit (first row)
        await $$("i.bi-pencil")[0].click();

        // Change User Role
        const roleDropdown = $("//label[text()='User Role']/../..//div[@class='oxd-select-text-input']");
        await roleDropdown.click();
        await $("//span[text()='" + updatedUserRole + "']").click();

        // Save
        await $("button[type='submit']").click();

        await browser.pause(2000);
    });

    it("Validate Updated Details", async () => {
        await $("//label[text()='Username']/../..//input").setValue(createdUser.username);
        await $("button[type='submit']").click();
        await browser.pause(1000);

        const roleCell = await $("div.oxd-table-card div:nth-child(3)").getText();
        expect(roleCell).toEqual(updatedUserRole);
    });

    it("Delete the User", async () => {
        // Click delete icon
        await $$("i.bi-trash")[0].click();

        // Confirmation popup → Yes Delete
        await $("button.oxd-button--label-danger").click();
        await browser.pause(2000);

        // Verify table empty or no record found
        const noRecords = await $("span.oxd-text--span").getText();
        expect(noRecords).toContain("No Records Found");
    });

});
