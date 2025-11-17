
Step-1
---



1. download the repo zip file and extract it 
2. open vs for the project directory
   
3. **Command\_1: ./setup.bat**
   	- will set up the aiohttp, opencv-python, mediapipe, numpy, speedtest-cli
   	-***IF*** there occurred an error with the Python version 
   		-install the python 3.12.x or 3.12.10 0r 3.12.8
   	-run the command again 
   
4. After the installation 
   
5. **Command\_2: .\\venv\\Scripts\\activate** 
   	**-**Setup the Virtual environment
   
6. **Command\_3: python server.p**y 
   -Run the python script
   
7. Check the web Browser with the link: Localhost:8080

&nbsp;	



X-------------------------------------------------------X------------------------------------------------X---------------------------------------------------------X




Step-2

---

1. go to the website: https://ngrok.com/download/windows
   -IF the defender blocks the download then 
   -Method 1: Restore from Quarantine (Best Option)

&nbsp;	-Your antivirus likely didn't block the download; it let it download and then immediately "quarantined" the file.

&nbsp;	-Open your antivirus program (Windows Defender, McAfee, Norton, etc.).

&nbsp;	-Look for a section called "Protection History," "Threat History," or "Quarantine."

&nbsp;	-You should see an entry for ngrok.zip or ngrok.exe that was "Blocked" or "Quarantined."

&nbsp;	-Click on this threat. You should see an option to "Restore" or "Allow on device."

&nbsp;	-Choose this option. This will move the file out of quarantine and usually adds it to an "allowlist" or "exclusion list" so it 	isn't blocked again.



&nbsp;   -Method 2: Add an Exclusion (The Permanent Fix)

&nbsp;	-This tells your antivirus to "trust" everything in your C:\\tools folder.

&nbsp;	-Open your antivirus settings.

&nbsp;	-Find the settings page for "Exclusions" or "Allowlist."

&nbsp;	-(In Windows Defender, this is under Virus \& threat protection > Manage settings > Add or remove exclusions).

&nbsp;	-Click "Add an exclusion" and choose to exclude a "Folder."

&nbsp;	-In the pop-up, navigate to your C: drive and select the C:\\tools folder you created.

&nbsp;	-After the exclusion is added, try to download ngrok.zip again. Save it directly to your C:\\tools folder and unzip it there. The 		antivirus will now ignore it.



&nbsp;    -Method 3: Temporarily Disable Antivirus (The Last Resort)

&nbsp;	-Warning: Only do this for the 2-3 minutes it takes to download and set up the file.

&nbsp;	-Open your antivirus program.

&nbsp;	-Find the "Real-time protection" or "Virus scanning" toggle.

&nbsp;	-Turn it OFF. Your computer is now temporarily vulnerable.

&nbsp;	-Quickly go to the ngrok website, download the .zip file.

&nbsp;	-Unzip ngrok.exe into your C:\\tools folder.

&nbsp;	-IMMEDIATELY go back to your antivirus and turn ON "Real-time protection."



2. Login (create an account)

3\. download the zip file to a folder in the desktop (eg: tool)

4\. extract it (to eg: tool, folder)

5\. open the extracted file and copy the .exe file to the main folder (tool folder)

6\. copy the (tool folder) path 

7\. Path setup:
	- 1. Open the System Properties Window:

&nbsp;	-Press your Windows Key.

&nbsp;	-Start typing Edit the system environment variables.

&nbsp;	-You will see this window:



&nbsp;	-2. Open the "Environment Variables" Window:

&nbsp;	-Click the "Environment Variables..." button at the bottom.

&nbsp;	-You will see this new window. It has two boxes.



&nbsp;	-3. Find Your User "Path" Variable:

&nbsp;	-Look only at the top box (the one that says "User variables for LENOVO").

&nbsp;	-In that list, find the row where the "Variable" is named "Path".

&nbsp;	-Click on the word "Path" to highlight it.

&nbsp;	-With "Path" highlighted, click the "Edit..." button.

&nbsp;	-It looks like this:


&nbsp;	-4. Add the C:\\tools Folder to the List:

&nbsp;	-A new window opens that shows a list of all the folders in your "contact list."

&nbsp;	-Click the "New" button on the right side.

&nbsp;	-A new, blank text box will appear at the bottom of the list.

&nbsp;	-In this new blank box, type: C:\\tools

&nbsp;	-It will look like this (your list will have different folders, but the idea is the same):


&nbsp;	-5. Save Your Changes:

&nbsp;	-Press "OK" to close the "Edit Path" window.

&nbsp;	-Press "OK" to close the "Environment Variables" window.

&nbsp;	-Press "OK" to close the "System Properties" window. 

X-------------------------------------------------------X------------------------------------------------X---------------------------------------------------------X



### Step-3

1. copy the tokens from the ngrok website after the log in and run the token in the terminal 

2\. Open 2 terminals in the vs code 

3\. one of the terminal run the **Command\_3: python server.p**y
	-Run the python script

4\. in the other terminal run the **Command\_4:** **ngrok http 8080**

**5. it will give a share link the shere link to any other system to check the connections** 




BY\_Pass\_Error:
---



**Command\_5: Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process**

for:

"PS C:\\Users\\LENOVO\\Desktop\\new\\ULANC-main\\ULANC-main> .\\venv\\Scripts\\activate

.\\venv\\Scripts\\activate : File C:\\Users\\LENOVO\\Desktop\\new\\ULANC-main\\ULANC-main\\venv\\Scripts\\Activate.ps1 cannot be 

loaded because running scripts is disabled on this system. For more information, see about\_Execution\_Policies at      

https:/go.microsoft.com/fwlink/?LinkID=135170.

At line:1 char:1

\+ .\\venv\\Scripts\\activate

\+ ~~~~~~~~~~~~~~~~~~~~~~~

    + CategoryInfo          : SecurityError: (:) \[], PSSecurityException

    + FullyQualifiedErrorId : UnauthorizedAccess

PS C:\\Users\\LENOVO\\Desktop\\new\\ULANC-main\\ULANC-main>"



