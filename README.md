Digital Asset Manager

Problem Statement/requirements - 
Users login,
store digital assets
CRUD on digital assets,
Share resources with other users


API calls:
/assets        - all actions depending on the ownerID (Email) authenticated through Cognito
GET - to get info of all Assets of a user - includes owned and shared assets sections. 
POST - TO add an asset (using S3 presigned URLs)
DELETE - TO delete all assets of user 

/assets/list 
GET- List all unique users inside the application 

/assets/selective
PUT - TO update comments of assets of whom assetIDs are provided in the AssetsList attribute through body of http request
DELETE -  TO delete assets of whom assetIDs are provided in the AssetsList attribute through body of http request

/assets/selective/view
GET - To show/list all attributes of assets of whom assetIDs are provided in the AssetsList attribute through body of http request

/assets/selective/download
GET - TO download all assets of whom assetIDs are provided in the AssetsList attribute through body of http request

/assets/selective/share
POST - To share all assets of whom assetIDs are provided in the AssetsList attribute through body of http request. To share is to add the email of shared user in the SharedWith list of that asset.



Lambdas:
Aryamanfunc3_1 -  /assets &  /assets/list
Aryamanfunc3_selective - /assets/selective & /assets/selective/view & /assets/selective/download & /assets/selective/share

DynamoDBs:
aryaman_p3_assets (Main table)
aryaman_p3_assetsowned (AssetOwnership table)

Main Table attributes:
AssetID (Partition Key)
OwnerID (Email)
AssetName
Location (S3Path)
Comments
SharedWith (List of users with which asset is shared)

AssetOwnership table attributes:
UserID (Email of every unique user of application -  used to identify user)
SharedWithList (List of AssetIds that are shared with that user by other users using the /assets/selective/share api)
OwnedAssetsList (AssetIds that owned/uploaded by the user himself)

