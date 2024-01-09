import React, { useState } from "react";
import styles from "./price-summary.module.scss";
import { FiPlus, FiRefreshCcw } from "react-icons/fi";
import { GrFormClose } from "react-icons/gr";

export default function PriceSummary(props) {
  // const [data, setData] = useState({
  //   discount: { name: "Discount", value: "", type: true, display: true },
  //   tax: { name: "Tax", value: "", type: true, display: false },
  //   shipping: { name: "Shipping", type: true, value: "", display: false },
  // });
  const{data, setData, currency} = props

  function handleChange(e) {
    e.preventDefault();
    const { value, name } = e.target;
    const onchangeVal = { ...data };

    if (name == "discountName") onchangeVal["discount"]["name"] = value;

    if (name == "discountValue") onchangeVal["discount"]["value"] = value;

    if (name == "taxName") onchangeVal["tax"]["name"] = value;

    if (name == "taxValue") onchangeVal["tax"]["value"] = value;

    if (name == "shippingName") onchangeVal["shipping"]["name"] = value;

    if (name == "shippingValue") onchangeVal["shipping"]["value"] = value;

    setData(onchangeVal);
  }

  function handleAdd(e) {
    e.preventDefault();
    const { name } = e.target;
    setData((prevState) => ({ ...prevState, [name]: { ...prevState[name], display: true } }));
  }

  function deleteItem(e, name) {
    e.preventDefault();
    setData((prevState) => ({ ...prevState, [name]: { ...prevState[name], display: false, value:"" } }));
  }

  function resetInput(e, name) {
    e.preventDefault();
    setData((prevState) => ({ ...prevState, [name]: { ...prevState[name], value: "" } }));
  }

  function toggleType(e) {
    e.preventDefault();
    const { name } = e.target;
    setData((prevState) => ({ ...prevState, [name]: { ...prevState[name], type: !prevState[name]["type"] } }));
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Trigger the click event on the desired button
      // Here, we're triggering the click event on the first button (index 0)
    }
  };

  return (
    <>
      {data?.discount?.display && (
        <div
          className={"mt-3 d-flex align-items-center justify-content-end " + styles["inputWrapper"]}
          style={{ gap: "13px" }}
        >
          <div>
            <input
              type="text"
              className={"form-control text-end " + styles["inputField"]}
              name="discountName"
              onChange={(e) => handleChange(e)}
              onKeyDown={handleKeyPress}
              value={data?.discount?.name}
            />
          </div>
          <div className={styles["input"]}>
            <input
              type="number"
              className="form-control"
              name="discountValue"
              onChange={(e) => handleChange(e)}
              onKeyDown={handleKeyPress}
              value={data?.discount?.value}
            />
            <button
              className={styles.toggler + " p-0 btn-white border-0"}
              onClick={toggleType}
              name="discount"
            >
              {data?.discount?.type ? "%" : currency }
            </button>
            <button
              className={"btn btn-white btn-sm " + styles.resetButton}
              onClick={(e) => resetInput(e, "discount")}
            >
              <FiRefreshCcw />
            </button>
          </div>
        </div>
      )}

      {data?.tax?.display && (
        <div
          className={"mt-2 d-flex align-items-center justify-content-end " + styles["inputWrapper"]}
          style={{ gap: "13px" }}
        >
          <div className={styles["text"]}>
            <input
              type="text"
              className={"form-control text-end " + styles["inputField"]}
              name="taxName"
              onChange={(e) => handleChange(e)}
              value={data?.tax?.name}
            />
          </div>
          <div className={styles["input"]}>
            <input
              type="number"
              className="form-control"
              name="taxValue"
              onChange={(e) => handleChange(e)}
              value={data?.tax?.value}
            />
            <button
              className={styles.toggler + " p-0 btn-transparent border-0"}
              onClick={toggleType}
              name="tax"
            >
              {data?.tax?.type ? "%" : currency }
            </button>
            <button
              className={"btn btn-white btn-sm " + styles.resetButton}
              onClick={(e) => resetInput(e, "tax")}
            >
              <FiRefreshCcw />
            </button>
            <button
              onClick={(e) => deleteItem(e, "tax")}
              className={"btn btn-white " + styles["deleteBtn"]}
            >
              <GrFormClose />
            </button>
          </div>
        </div>
      )}

      {data?.shipping?.display && (
        <div
          className={"mt-2 d-flex align-items-center justify-content-end " + styles["inputWrapper"]}
          style={{ gap: "13px" }}
        >
          <div className={styles["text"]}>
            <input
              type="text"
              className={"form-control text-end " + styles["inputField"]}
              name="shippingName"
              onChange={(e) => handleChange(e)}
              value={data?.shipping?.name}
            />
          </div>
          <div className={styles["input"]}>
            <input
              type="number"
              className="form-control"
              name="shippingValue"
              onChange={(e) => handleChange(e)}
              value={data?.shipping?.value}
            />
            <button
              className={styles.toggler + " p-0 btn-transparent border-0"}
              onClick={toggleType}
              name="shipping"
            >
              {data?.shipping?.type ? "%" : currency }
            </button>
            <button
              className={"btn btn-white btn-sm " + styles.resetButton}
              onClick={(e) => resetInput(e, "shipping")}
            >
              <FiRefreshCcw />
            </button>
            <button
              onClick={(e) => deleteItem(e, "shipping")}
              className={"btn btn-white " + styles["deleteBtn"]}
            >
              <GrFormClose />
            </button>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end mt-2" style={{ gap: "13px" }}>
        {!data?.tax?.display && (
          <div>
            <button
              className="d-flex align-items-center btn btn-white btn-sm text-success"
              name="tax"
              onClick={(e) => handleAdd(e)}
            >
              <FiPlus /> Tax
            </button>
          </div>
        )}
        {!data?.shipping?.display && (
          <div>
            <button
              className="d-flex align-items-center btn btn-white btn-sm text-success"
              name="shipping"
              onClick={(e) => handleAdd(e)}
            >
              <FiPlus /> Shipping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
