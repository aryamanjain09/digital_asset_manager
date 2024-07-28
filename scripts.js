const apiUrl = 'https://oa5mm7srzl.execute-api.us-east-1.amazonaws.com/dev1';
let token = localStorage.getItem('token');

function getAssets() {
    fetch(`${apiUrl}/assets`, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayAssets(data);
    })
    .catch(error => console.error('Error:', error));
}

function displayAssets(data) {
    const assetList = document.getElementById('assetList');
    assetList.innerHTML = '';
    data.forEach(asset => {
        const assetItem = document.createElement('div');
        assetItem.innerHTML = `
            <div>
                <h3>${asset.AssetName} (${asset.AssetType})</h3>
                <p>${asset.Comments}</p>
                <button onclick="viewAsset('${asset.AssetID}')">View</button>
                <button onclick="deleteAsset('${asset.AssetID}')">Delete</button>
                <button onclick="showUpdateAssetForm('${asset.AssetID}')">Update</button>
                <button onclick="showShareAssetForm('${asset.AssetID}')">Share</button>
                <button onclick="downloadAsset('${asset.AssetID}')">Download</button>
            </div>
        `;
        assetList.appendChild(assetItem);
    });
}

function showAddAssetForm() {
    document.getElementById('addAssetForm').style.display = 'block';
}

function addAsset() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const assetName = document.getElementById('assetName').value;
    const assetType = document.getElementById('assetType').value;
    const assetComments = document.getElementById('assetComments').value;

    // Get presigned URL for upload
    fetch(`${apiUrl}/assets`, {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            AssetName: assetName,
            AssetType: assetType,
            Comments: assetComments
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Presigned URL:', data);
        const { url, fields } = data;
        
        // Upload file to S3
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value);
        });
        formData.append('file', file);

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(() => {
            console.log('File uploaded successfully');
            getAssets();
        })
        .catch(error => console.error('Error uploading file:', error));
    })
    .catch(error => console.error('Error:', error));
}

function deleteAsset(assetId) {
    fetch(`${apiUrl}/assets/selective`, {
        method: 'DELETE',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            AssetsList: [assetId]
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Deleted:', data);
        getAssets();
    })
    .catch(error => console.error('Error:', error));
}

function viewAsset(assetId) {
    fetch(`${apiUrl}/assets/selective/view`, {
        method: 'GET',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            AssetsList: [assetId]
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Asset:', data);
        alert(JSON.stringify(data, null, 2));
    })
    .catch(error => console.error('Error:', error));
}

function showUpdateAssetForm(assetId) {
    const newComments = prompt('Enter new comments:');
    if (newComments) {
        fetch(`${apiUrl}/assets/selective`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                AssetsList: [assetId],
                Comments: newComments
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Updated:', data);
            getAssets();
        })
        .catch(error => console.error('Error:', error));
    }
}

function showShareAssetForm(assetId) {
    const sharedWithEmail = prompt('Enter email to share with:');
    if (sharedWithEmail) {
        fetch(`${apiUrl}/assets/selective/share`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                AssetsList: [assetId],
                SharedWith: [sharedWithEmail]
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Shared:', data);
            getAssets();
        })
        .catch(error => console.error('Error:', error));
    }
}

function downloadAsset(assetId) {
    fetch(`${apiUrl}/assets/selective/download`, {
        method: 'GET',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            AssetsList: [assetId]
        })
    })
    .then(response => response.json())
    .then(data => {
        const url = data.Location;
        const a = document.createElement('a');
        a.href = url;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    })
    .catch(error => console.error('Error:', error));
}

function getUsers() {
    fetch(`${apiUrl}/assets/list`, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayUsers(data);
    })
    .catch(error => console.error('Error:', error));
}

function displayUsers(data) {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    data.forEach(user => {
        const userItem = document.createElement('div');
        userItem.textContent = user.UserID;
        userList.appendChild(userItem);
    });
}

// Check if user is logged in
if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');
    if (idToken) {
        localStorage.setItem('token', idToken);
        document.getElementById('login').style.display = 'none';
        document.getElementById('main').style.display = 'block';
        token = idToken;
    }
}
