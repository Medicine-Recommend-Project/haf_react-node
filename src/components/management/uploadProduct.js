import React, {useState, initialState} from "react";
import FileUpload from '../../components/home/FileUpload';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Continents =[
    {key:1, value:"Africa"},
    {key:2, value:"Europe"},
    {key:3, value:"North America"},
    {key:4, value:"South America"},
    {key:5, value:"Asia"},
    {key:6, value:"Australia"},
    {key:7, value:"Antarctica"}
]

function UploadProduct(props){

    const [newProduct, setNewProduct] = useState({
        pname: "", description: "", price : 0, continents: "Europe"
    });

    let onTyping = (e)=> {
        setNewProduct({...newProduct, [e.target.name]: e.target.value});
    }// end of onTyping()

    const[Images, setImages] =useState(1)
    const[Image, setImage] =useState(initialState);

    const updateImages =(newImages) =>{
        // console.log('newImage : ', newImages)
        setImages(newImages);
    }

    const submitHandler =(event) => {
        event.preventDefault();

        for(let i in Object.keys(newProduct)) {
            if (newProduct[Object.keys(newProduct)[i]] === "" || newProduct[Object.keys(newProduct)[i]].length === 0) {
                alert('빈칸을 채워주세요')
            }
        }

        let url = '/management/addProduct';
        //서버에 채운값을을 request에 보낸다
        const body ={
            pname: newProduct.pname,
            description : newProduct.description,
            price : newProduct.price,
            images : Images,
            continents: newProduct.continents
        }

        axios.post(url, body)
            .then(response => {
                if(response.data > 0) {
                    alert('상품 업로드 성공')
                    props.history.push('/');
                }else {
                    alert('상품업로드 실패')
                }
            })
            .catch(e => { console.log(e);})
    }
    return (

        <div style={{maxWidth: '700px', margin: '2rem auto'}}>
            <div style={{textAlign:'center', marginBottom:'2rem'}}>
                <h2>의약품 업로드</h2>
            </div>
            <form onSubmit={submitHandler}>
                <FileUpload refreshfunction={updateImages} />
                <br/>
                <label>이름</label>
                <input type="text" name="pname" value={newProduct.pname} onChange={onTyping}/>
                <br/>
                <br/>
                <label>설명</label>
                <textarea name="description" cols="30" rows="10" onChange={onTyping} value={newProduct.description}> </textarea>
                <br/>
                <br/>
                <label>가격(\)</label>
                <input type="number" name="price" value={newProduct.price} onChange={onTyping}/>
                <br/>
                <select name="continents" onChange={onTyping} value={newProduct.continents}>
                    {Continents.map((item,i) =>(
                        <option key={i} value={item.value}>{item.value}</option>
                    ))}
                </select>
                <br/>
                <br/>
                <label>제조국</label>
                <button type="submit" onClick={submitHandler}>상품 업로드</button>
            </form>
        </div>

    )
}

export default UploadProduct;