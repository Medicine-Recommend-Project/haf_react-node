import react, {useEffect, useState} from "react";
import axios from "axios";

const ChangeCpw = (props)=> {
    // 대/소문자,숫자 포함하여 6글자 이상
    const regEngNum6 = /^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.+?[^\W|_])[\w!@#$%^&*()-_+={}\|\\\/]+$/g;

    const [changeCpw, setChangeCpw]= useState({ oldCpw: "", cpw: "", pwCheck: ""});
    const [checkRs, setCheckRs] = useState({pwRs : "", eq : "false"});
    useEffect(()=>{ setCheckRs({...checkRs, eq: "false"}) },[])

    let onTyping = (e)=> {
        // console.log([e.target.name],' : ', e.target.value)
        setChangeCpw({...changeCpw, [e.target.name]: e.target.value});

        switch (e.target.name) {
            case 'cpw':
                if(e.target.value === changeCpw.pwCheck) { setCheckRs({ ...checkRs, eq: "true"  }); }
                else { setCheckRs({ ...checkRs, eq: "false" }); }

                if (regEngNum6.test(e.target.value)) {
                    setCheckRs({...checkRs, pwRs: '🟢'});
                } else {
                    setCheckRs({...checkRs, pwRs: '❌ 영문/숫자만 포함 6글자 이상이여야합니다.' , eq: "false"});
                }
                break;

            case 'pwCheck':
                if (e.target.value === changeCpw.cpw) {
                    setCheckRs({ ...checkRs, eq: "true"  });
                } else {
                    setCheckRs({ ...checkRs, eq: "false" });
                }
                if(!regEngNum6.test(e.target.value)) setCheckRs({ ...checkRs, eq: "false" });
                break;

            default: break;
        }

    }

    let width = 800;
    let height = 200;
    const pwStyle = {
        backgroundColor: "#777777" ,
        color: "white" ,
        display: "block",
        position: "absolute",
        width: width,
        height: height,
        padding: "7px",
        left: (window.screen.width / 2) - (width / 2),
        top: (window.screen.height / 2) - (height / 2)
    };

    //비밀번호 변경 통신
    let submitCpw = async () => {
        //빈칸 확인
        for(let i in Object.keys(changeCpw)){
            if(changeCpw[Object.keys(changeCpw)[i]] === "" || changeCpw[Object.keys(changeCpw)[i]].length === 0){
                alert('빈칸을 채워주세요!');
                return;
            }//end of if()
        }//end of for()
        if(checkRs.eq === "false"){
            alert('비밀번호 양식/재확인 확인해주세요.');
            return;
        }

        let url = '/customer/changeCpw' ;
        let data = {cid: props.cid, cpw: changeCpw.cpw, oldCpw: changeCpw.oldCpw};

        axios.post(url, data)
            .then(res => {
                if(res.data > 0){
                    alert('수정되었습니다.');
                    props.handler('close');
                }else if(res.data === 0){
                    alert('기존의 비밀번호가 틀렸습니다.');
                } else{
                    alert('수정에 실패하였습니다. 다시 시도해주세요.');
                }
            }).catch(e => {
            console.log(e);
            alert('수정에 실패하였습니다. 다시 시도해주세요.');
        });//end of axios.post();
    }//end of submitForm()

    return(
        <div style={pwStyle}>
            기존 비밀번호 입력 <input type="password" onChange={onTyping} name="oldCpw"/> <br/>
            새 비밀번호 <input type="password" onChange={onTyping} name="cpw"/> {checkRs.pwRs}<br/>
            새 비밀번호 재 확인 <input type="password" onChange={onTyping} name="pwCheck"/> <br/>
            <button onClick={e=>{ e.preventDefault(); submitCpw(); }}>수정하기</button>
            <button onClick={e=>{ e.preventDefault(); props.handler("close"); }}>닫기</button>
        </div>
    );
}

export default ChangeCpw;