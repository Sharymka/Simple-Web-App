import React, {useContext} from 'react';
import {UsersContext} from "../UsersContext";

function CheckBox(props) {

    const { handleCheckBox, selectedId } = useContext(UsersContext);
    const { value } = props;

    return (
        <div>
            <input className="form-check-input ms-3 me-0"
                   type="checkbox"
                   checked={selectedId.includes(value) || value === true}
                   onChange={() => handleCheckBox(value)}
            />
            <label className="form-check-label" htmlFor="inlineCheckbox1"></label>
        </div>
    );
}

export default CheckBox;