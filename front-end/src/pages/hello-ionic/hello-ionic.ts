import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer';
import { LoadingController } from 'ionic-angular';
@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  public base64Image:string;
  public emotion = "";
 
  constructor(private camera:Camera,private transfer: FileTransfer,private loadingCtrl:LoadingController) {
  }
  
  takePhoto(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      correctOrientation: true
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
     let cameraImageSelector = document.getElementById('faceImage');
     cameraImageSelector.setAttribute('src',this.base64Image);
     
    }, (err) => {
     // Handle error
    
    });
  }

  getPhoto(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit:true,
      targetWidth:300,
      targetHeight:300
     
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
     let cameraImageSelector = document.getElementById('faceImage');
     cameraImageSelector.setAttribute('src',this.base64Image);
     
    }, (err) => {
     // Handle error
    
    });
  }
  
  uploadPhoto(){
    let loader = this.loadingCtrl.create({
      content:"uploading..."
    });
    loader.present();
    const filetransfer:FileTransferObject = this.transfer.create();
    var random = Math.floor(Math.random()*100);
    // options
    let options: FileUploadOptions = {
      fileKey:'photo',
      fileName:random+"emotion_dection.jpg",
      chunkedMode:false,
      httpMethod:'post',
      mimeType:'image/jpeg',
      headers:{}
    }

    filetransfer.upload(this.base64Image,'http://ec2-34-239-186-142.compute-1.amazonaws.com:3001',options)
        .then((data) => {
          this.emotion = data.response;
          loader.dismiss();
        },(err) => {
          console.log(err);
          alert(err.message);
          loader.dismiss();
        });
  }


}
