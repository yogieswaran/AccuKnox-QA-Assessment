describe("OrangeHRM User Management Flow", () => {

    const adminUser = "Admin";
    const adminPass = "admin123";

    const createdUser = {
        role: "ESS",
        employeeName: "Paul Collings",
        username: "autoUser_" + Date.now(),
        password: "Test@12345"
    };

    const updatedUserRole = "Admin"; 

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
        await $("button[data-v-10d463b7]").click(); 

      
        await $("//label[text()='User Role']/../..//div[@class='oxd-select-text-input']").click();
        await $("//span[text()='" + createdUser.role + "']").click();

      
        await $("input[placeholder='Type for hints...']").setValue(createdUser.employeeName);
        await $("div[role='option']").click();

       
        await $("//label[text()='Username']/../..//input").setValue(createdUser.username);

       
        await $("//label[text()='Status']/../..//div[@class='oxd-select-text-input']").click();
        await $("//span[text()='Enabled']").click();

        await $("//label[text()='Password']/../..//input").setValue(createdUser.password);

    
        await $("//label[text()='Confirm Password']/../..//input").setValue(createdUser.password);

      
        await $("button[type='submit']").click();

        await browser.pause(2000);
    });

    it("Search Newly Created User", async () => {
 
        await $("//label[text()='Username']/../..//input").setValue(createdUser.username);

        await $("button[type='submit']").click();
        await browser.pause(2000);

        const tableText = await $("div.oxd-table-card").getText();
        expect(tableText).toContain(createdUser.username);
    });

    it("Edit User Details", async () => {

        await $$("i.bi-pencil")[0].click();

        const roleDropdown = $("//label[text()='User Role']/../..//div[@class='oxd-select-text-input']");
        await roleDropdown.click();
        await $("//span[text()='" + updatedUserRole + "']").click();

  
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
       
        await $$("i.bi-trash")[0].click();

       
        await $("button.oxd-button--label-danger").click();
        await browser.pause(2000);


        const noRecords = await $("span.oxd-text--span").getText();
        expect(noRecords).toContain("No Records Found");
    });

});
