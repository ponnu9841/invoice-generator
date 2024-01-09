import { useState } from "react";
import styles from "./number.module.scss";
import { FiPlus } from "react-icons/fi";
import { GrFormClose } from "react-icons/gr";

export default function PoNumber(props) {
  // const [data, setData] = useState([{ name: "PO Number", value: "" }]);
  const{data, setData} = props

  const handleClick = (e) => {
    e.preventDefault();
    setData([...data, { name: "New", value: "" }]);
  };
  const handleChange = (e, i) => {
    const { name, value } = e.target;
    const onchangeVal = [...data];
    onchangeVal[i][name] = value;
    setData(onchangeVal);
  };
  const handleDelete = (e, i) => {
    e.preventDefault();
    const deleteVal = [...data];
    deleteVal.splice(i, 1);
    setData(deleteVal);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Trigger the click event on the desired button
      // Here, we're triggering the click event on the first button (index 0)
    }
  };

  return (
    <>
      {data?.map((item, i) => (
        <div
          className={"mt-2 d-flex align-items-center justify-content-end "+styles.wrapper}
          style={{ gap: "5px" }}
          key={i}
        >
          <div className={styles["text"]}>
            <input
              type="text"
              className={styles["inputHeading"] + " form-control text-end"}
              name="name"
              onChange={(e) => handleChange(e, i)}
              onKeyDown={handleKeyPress}
              value={item.name}
            />
          </div>
          <div className={styles["dateInput"]}>
            <input
              type="number"
              className={"form-control " + styles["form-input-sm2"]}
              name="value"
              onChange={(e) => handleChange(e, i)}
              onKeyDown={handleKeyPress}
              value={item.value}
            />
            {data?.length > 1 && i != 0 && (
              <button onClick={(e) => handleDelete(e, i)} className={styles["deleteButton"]}>
                <GrFormClose />
              </button>
            )}
          </div>
        </div>
      ))}

      {data?.length < 5 && (
        <button onClick={handleClick} className={"btn btn-white btn-sm mt-2 text-success p-0"}>
          <FiPlus />
          Add
        </button>
      )}
    </>
  );
}
