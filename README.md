1.Authentication
Simple email + password based authentication

2.Password generator
password generator -> example ui -> https://passwords-generator.org/
 Create a generator component:

Length slider (min 8 to max 32)

Checkboxes for uppercase, lowercase, numbers, symbols

Option to exclude similar chars (like O/0, l/1)

 Add “Generate” + “Copy” buttons

 Implement auto-clear clipboard after 10–20s (setTimeout)
 /* code can be used

 const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");

    // Auto-clear after 15 seconds
    setTimeout(async () => {
      await navigator.clipboard.writeText(""); // overwrite clipboard
      console.log("Clipboard cleared!");
    }, 15000); // 15000 ms = 15 seconds
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
*/
<!-- <button
  onClick={() => copyToClipboard(generatedPassword)}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Copy Password
</button> -->

3.Secure vault password saving ui
    password generator ui contains an option of save to vault which on click directs to a page  where it can fill the details of the user but the password is auto filled
    then on saving is directed to a save fault page where it can see all the passwords and other details
<!-- password saved in the data base should be encrypted using library like cryptojs which can decrypt it when the secure vault is accessed -->

4.Secure vault
    Build a dashboard page /vault

    List all items (title, username, etc.)

    Add a search/filter input (client-side)

    Integrate edit/delete buttons (modals)

    Add copy password feature with auto-clear