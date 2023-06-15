function beginDownload() {

    //! Get the input values
    const input1 = document.querySelector('.task1').value
    const input2 = document.querySelector('.task2').value

    //! Get the reference to the text area element
    const studentNames = document.querySelector('.student-names-textarea');
    const studentNumbers = document.querySelector('.student-numbers-textarea');

    // Retrieve the text content from the text area element
    const names = studentNames.value;
    const numbers = studentNumbers.value;

    // Split the text content into an array of lines
    const nameR = names.split('\n');

    // Filter out empty lines
    const namesArray = nameR.filter(name => name.trim() !== '');

    const numR = numbers.split('\n');
    const numbersArray = numR.filter(name => name.trim() !== '');


    startCycle(numbersArray, namesArray, "BYB1", "BYB2")
}

// loop to download all files
async function startCycle(numArray, nameArray, task1, task2) {

    for (let i = 0; i < numArray.length; i++) {
        //filesSearch(task, studentNumber)) 
        await filesSearch(numArray[i], task1, nameArray[i])
        await filesSearch(numArray[i], task2, nameArray[i])
    }

}

//=================================DROPBOX=================================//
async function filesSearch(SNum, task, SName) {
    console.log(SName)
    console.log(task)
    console.log(SNum)
    console.log('================')

    await dbx.filesSearchV2({
        query: task,
        options: {
            path: "/" + SNum,
            //file_extensions: [".pdf"],
            max_results: 1,
        },
    })
        .then(function (response) {
            //console.log(response.result.matches[0].metadata)
            //const studentName = response.metadata.name
            downloadFileBob(response.result.matches[0].metadata.metadata, task, SName);
        })
        .catch(function (error) {
            console.log('error', error)

        });
}


//download the selected files in zip format
async function downloadFileBob(path, task, SName) {

    const parts = path.path_display.split('/'); // Split the string by "/"
    const parentPath = parts.slice(0, 4).join('/'); // Join the first three parts with "/"

    await dbx
        .filesDownloadZip({ path: parentPath })
        .then(function (response) {
            console.log('response', response.result)
            const blob = new Blob([response.result.fileBlob], { type: "application/zip", });
            getDLLink(blob, SName, task);
        })
        .catch(function (error) {
            console.log(error);
            alert(
                "Error downloading file. Download folder could be containing more than 100 files"
            );
        });
}

//Creates a download link and automatically clicks on it to download the file.
function getDLLink(blob, name, task) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = name + " - " + task;
    link.download = fileName
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}