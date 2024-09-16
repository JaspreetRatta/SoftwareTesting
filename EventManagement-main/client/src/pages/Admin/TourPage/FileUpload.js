// rafce
import React from "react";
import Resize from "react-image-file-resizer";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../helpers/axiosInstance";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/alertsSlice";

import { Avatar, Badge } from "antd";

const FileUpload = ({ values, setValues}) => {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const handleChangeFile = (e) => {

    dispatch(ShowLoading());
    const files = e.target.files;

    if(files){
      // console.log(files);
      let allfileUpload = values.images
      for(let i=0; i< files.length; i++){
        // console.log(files[i]);
        
        Resize.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri)=>{
            //
            axiosInstance.post("/api/cloundinary/images",
            {
              image:uri
            }
          ).then(res=>{
  
            allfileUpload.push(res.data);
            // console.log("allfileupload in then", allfileUpload);
            setValues({ ...values, images: allfileUpload });
            dispatch(HideLoading());

          }).catch(err=>{
            console.log(err);
            dispatch(HideLoading());
          })
          },
          "base64"
        )
      }
      dispatch(HideLoading());
    }else{
      console.log("errorfiles");
    }
    
  };

  const handleRemove = (public_id) => {
    dispatch(ShowLoading());
    console.log(public_id);
    // const img = values.images
    const { images } = values;
    axiosInstance
      .post(
        "/api/cloundinary/removeimages",
        { public_id },
      )
      .then((res) => {
 
        let filterImages = images.filter((item) => {
          return item.public_id !== public_id;
        });
        setValues({ ...values, images: filterImages });
        dispatch(HideLoading());

      })
      .catch((err) => {
        //err
        console.log(err);
        dispatch(HideLoading());
      });
      
  };

  return (
    <>
      <br />

      {values.images &&
        values.images.map((c) => (
          <span className="avatar-item">
            <Badge
              onClick={() => handleRemove(c.public_id)}
              style={{ cursor: "pointer" }}
              count="X"
            >
              <Avatar className="m-3" src={c.url} shape="square" size={120} />
            </Badge>
          </span>
        ))}

      <hr />
      <div className="form-group">
        <label className="btn btn-primary">
          Choose File...
          <input
            onChange={handleChangeFile}
            className="form-control"
            type="file"
            hidden
            multiple
            accept="images/*"
            name="file"
          />
        </label>
      </div>
      <br />
    </>
  );
};

export default FileUpload;
