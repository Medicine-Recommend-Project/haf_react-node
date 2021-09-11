import React, {useState } from 'react'
import Dropzone from 'react-dropzone'

import {Button} from 'react-bootstrap'
import axios from "axios";

function FileUpload(props) {

  const [Images, setImages] = useState([]);

  const dropHandler =(files) => {
    let url = '/api/management/image';
    let formData = new FormData();
    let config ={ header:{'content-type': 'multipart/form-data'} }
    formData.append("file", files[0]);

    // console.log('files[0] : ',files[0])

    axios.post(url, formData , config)
      .then(response => {
        if(response.data.result) {
            setImages([...Images, response.data.filePath ]); // 서버에 최종 데이터를 전달하기 위해 저장
            props.refreshfunction([...Images, response.data.filePath]);   //상위컴포넌트한테  filepath 값을 보내줌
        }else {
          alert('파일저장 실패. 다시 시도해주세요.')
        }
      })
        .catch(err =>{
            console.log(err);
            alert('에러 발생. 잠시 후 다시 시도해주세요.');
        })
  }

    // 이미지를 지우는 기능
  const deleteHandler =(image) =>{
    const currentIndex = Images.indexOf(image); //Images에서 파일명이 일치 인덱스를 반환
    
    // console.log('currentIndex', currentIndex)
    let newImages = [...Images]
    newImages.splice(currentIndex, 1);  //useState에서 호출된 이미지 명과 동일한 애를 지우고 다시 등록?
              //splice <- 자바스크립트 내장함수임 배열의 특정항목을 제거할때 사용 
    setImages(newImages);
    props.refreshfunction(newImages);
  }


    return (
        <div style={{ display:'flex', justifyContent: 'space-between'}}>
          <Dropzone onDrop={dropHandler}>
            {({getRootProps, getInputProps}) => (
              <section>
                <div style={{width:300, height:240, border: '1px solid lightgray',
                    display: 'flex', alignItems:'center', justifyContent:'center'}}
                    {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <Button variant="outline-primary" size='lg'>Upload Photo</Button>
                </div>
              </section>
            )}

          </Dropzone>
          <div style={{display:'flex' , width:'350px', height:'240px', overflowX:'scroll'}}>

            {Images.map((image, index)=> (
              // ${image} 안에는 '/uploads/파일명'이 들어있음 ex) uploads\1618413568589_270px-His-tag.png
              <div onClick={()=>deleteHandler(image)} key={index}>
                <img style={{ minWidth:'300px', width:'300px', height:'240px'}}
                  src={`http://localhost:3001/${image}`} />
              </div>

            ))}
          </div>

        </div>
    )
}

export default FileUpload