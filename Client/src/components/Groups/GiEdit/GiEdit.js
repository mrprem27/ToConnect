import React, { useRef, useState } from "react";
import * as api from '../../../api'
import FileBase from 'react-file-base64'
import defaultGroupImage from '../../../images/group.png'
import './styleGiEdit.css'
import Loader from '../../Loader/Loader'

const GiEdit = ({ setWantToEdit, idg, setSelectedFile, setGroupName, selectedFile }) => {
    const newName = useRef(null);

    const [modalContent, setModalContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (newName.current.value.length < 1)
            setModalContent("Group name Can't be Empty!!")
        else {
            try {
                const { data } = await api.editGroupName({ newData: { newName: newName.current.value, dp: selectedFile }, idg: idg });
                console.log("Name Changed");
                setSelectedFile(selectedFile);
                setGroupName(newName.current.value);
                setWantToEdit(false);
            } catch (error) {
                setModalContent(error.message)
            }
        }
        setIsLoading(false);
    }
    return (
        <div className="hello_gc_edit">
            {isLoading &&
                <div className="loader">
                    <div className="loader_in">
                        <Loader />
                    </div>
                </div>
            }
            <div className="gc_edit_container">
                <div className={modalContent.length > 0 ? "modal_gc_edit show_class" : "modal_gc_edit"}>
                    <div className="gc_edit_modal_base">
                        {modalContent}
                    </div>
                </div>
                <div className="gc_edit_all">
                    <div className="gc_edit_top">
                        <button onClick={() => setWantToEdit(false)}>Cancel</button>
                        <h2>Edit Group Name and Photo</h2>
                    </div>
                    <div className="gc_edit_form">
                        <form onSubmit={submitHandler}>
                            <div className="gc_edit_img">
                                <img src={selectedFile ? selectedFile : defaultGroupImage} alt='Select an Image as Dp of Group' />
                            </div>
                            <input
                                type="text"
                                id="fullname_grp"
                                name="fullname_grp"
                                placeholder="Group Name"
                                ref={newName}
                            />
                            <FileBase
                                type="file"
                                multiple={false}
                                onDone={({ base64 }) => setSelectedFile(base64)}
                            />
                            <button type="submit">Make Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default GiEdit;