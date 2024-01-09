import { Fragment, useState } from "react";
import styles from "./multiple-input.module.scss";
import { FiPlus } from "react-icons/fi";
import { GrFormClose } from "react-icons/gr";

export default function MultipleInput(props) {
	//   const [data, setData] = useState([{ quantity: "", rate: "", description: "" }]);
	const { data, setData, currency } = props;

	const handleClick = (e) => {
		e.preventDefault();
		setData([...data, { quantity: 0, rate: 0, description: "" }]);
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

	const [textareaHeight, setTextareaHeight] = useState({})

	function handleTextareaChange(e, i) {
		e.preventDefault();
		const { name, value } = e.target;
		const onchangeVal = [...data];
		onchangeVal[i][name] = value;
		setData(onchangeVal);

		if(value){
			setTextareaHeight((prevState) => ({ ...prevState, [name+i]: e.target.scrollHeight }));
		}
		else{
			setTextareaHeight((prevState) => ({ ...prevState, [name+i]: null }));
		}

		
	  }

	  console.log(data)

	return (
		<Fragment>
			<div
				className={"bg-dark text-white rounded py-1 mb-2 " + styles["header"]}
			>
				<div className={styles["inputDesc"] + " ps-2 text"}>Item</div>
				<div className={styles["value"] + " text"}>Quantity</div>
				<div className={styles["value"] + " text"}>Rate</div>
				<div className={styles["value"] + " text text-end"}>Amount</div>
			</div>

			{data?.map((val, i) => (
				<div
					className={
						"row justify-content-center align-items-center mb-2 " +
						styles.inputWrapper
					}
					key={i}
				>
					<div className="col-8">
						<textarea
							name="description"
							className={"form-control "}
							onChange={(e) => handleTextareaChange(e, i)}
							placeholder="Description of service of product"
							value={val.description}
							style={{ height: textareaHeight["description"+i] || "35px" }}
						></textarea>
					</div>
					<div className="col-4">
						<div className="row">
							<div className="col">
								<input
									name="quantity"
									value={val.quantity}
									type="number"
									placeholder="Quantity"
									onChange={(e) => handleChange(e, i)}
									onKeyDown={handleKeyPress}
									className={"form-control "}
								/>
							</div>
							<div className="col">
								<input
									name="rate"
									type="number"
									value={val.rate}
									onChange={(e) => handleChange(e, i)}
									onKeyDown={handleKeyPress}
									className={"form-control "}
								/>
							</div>
							<div className={" text-end pe-0 col my-auto"}>
								<div className="position-relative">
									{currency}
									{data[i]["quantity"] * data[i]["rate"]}

									{data?.length > 1 && i != 0 && (
										<button
											onClick={(e) => handleDelete(e, i)}
											className={styles["deleteBtn"]}
										>
											<GrFormClose />
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			))}

			<button
				onClick={handleClick}
				className={styles["addButton"] + " btn btn-success text-white"}
			>
				<FiPlus />
				Add
			</button>
			{/* <p>{JSON.stringify(data)}</p> */}
		</Fragment>
	);
}
