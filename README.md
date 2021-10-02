# Check license Appointments

A program which automates checking and signing into driver's licence
appointments.

## Installation + Usage
__note: Currently the extraction of appointment locations has not yet be at the momenten fully automated. This will render this script useless for most people.__

1. Download the binary suitable to your platform and the `exampleProfile.json5`
   from the latest release on the [releases]() page.
2. Move both files to their own folder somewhere on your PC.
3. Create a copy of `exampleProfile.json5` named `profile.json5` and fill it
   out with your information as described by the file.
4. Run the executable. This will open a browser window where you can monitor the progress of the script.
5. When a suitable appointment is found icbc will send you an email with a confirmation code. A text field will appear on the page that was opened in the browser. Submit this code to complete the booking process.
6. If you wish to continue searching or the appointment that was found was unsuitable, you can leave the script running. It'll continue to look for appointments that may pop up which are sooner than the existing ones.
7. Otherwise, copy the appointment info down and stop the script.
