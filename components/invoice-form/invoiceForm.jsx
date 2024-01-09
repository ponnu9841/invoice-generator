import styles from "./invoiceform.module.scss";
import ImageUpload from "../image-upload/imageUpload";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import DatePicker from "../date-picker/datePicker";
import MultipleInput from "../mulitple-input/mulitple-input";
import PriceSummary from "../price-summary/price-summary";
import { dataState } from "../data";
import PoNumber from "../number-input-adder/poNumber";
import { currencyDataList } from "@/data/currency";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PrintTemplate from "../printTemplate/print";
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";

export default function InvoiceForm() {
	const router = useRouter();

	const { data, setData } = dataState();
	const [base64Data, setBase64Data] = useState(null);

	const [date, setDate] = useState(new Date());
	const [dueDate, setDueDate] = useState(new Date());
	const [mulitpleInputData, setMultipleInputData] = useState([
		{ quantity: 0, rate: 0, description: "" },
	]);

	const [numberInput, setNumberInput] = useState([
		{ name: "PO Number", value: "" },
	]);

	const [priceSummary, setPriceSummary] = useState({
		discount: { name: "Discount", value: "", type: true, display: true },
		tax: { name: "Tax", value: "", type: true, display: false },
		shipping: { name: "Shipping", type: true, value: "", display: false },
	});

	const [selectedCurrency, setSelectedCurrency] = useState("₹");

	async function formHandler(e) {
		e.preventDefault();
		const input = document.getElementById("printForm");
		input.classList.remove("d-none");

		html2canvas(input, {
			logging: true,
			letterRendering: 1,
			useCORS: true,
		}).then((canvas) => {
			const imgWidth = 208;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			const imgData = canvas.toDataURL("image/png");
			console.log(imgData);
			const pdf = new jsPDF("p", "mm", "a4");
			pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
			pdf.save("invoice.pdf");

			input.classList.add("d-none");

			let localData = localStorage.getItem("saveData");
			if (!localData) {
				var data = [saveData];
				localStorage.setItem("saveData", JSON.stringify(data));
				setPrevData(data);
			} else {
				var data = saveData;
				var existingData = JSON.parse(localData);
				if (existingData.length < 5) {
					var alredyExist = false;
					var index = null;
					existingData?.forEach((e, i) => {
						if (e.invoiceNumber == saveData?.invoiceNumber) {
							alredyExist = true;
							index = i;
						} else {
							alredyExist = false;
						}
					});
					if (!alredyExist) {
						existingData.push(saveData);
						localStorage.setItem("saveData", JSON.stringify(existingData));
						setPrevData(existingData);
					} else {
						existingData[index] = JSON.parse(JSON.stringify(saveData));
						localStorage.setItem("saveData", JSON.stringify(existingData));
						setPrevData(existingData);
					}
				}
			}
		});
	}

	function handleChange(e) {
		e.preventDefault();
		const { name, value } = e.target;
		setData((prevState) => ({ ...prevState, [name]: value }));
	}

	function getDate(date) {
		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		return `${year}-${month}-${day}`;
	}

	var subTotal = 0;
	var discount = 0;
	var tax = 0;
	var shippingCharge = 0;

	mulitpleInputData?.forEach((e) => {
		var total = parseFloat(e?.quantity) * parseFloat(e?.rate);
		subTotal = subTotal + total;
	});

	var balance = subTotal;

	if (priceSummary) {
		if (priceSummary?.discount?.value) {
			if (priceSummary?.discount?.type) {
				// discount in percentage
				balance =
					subTotal -
					(subTotal * parseFloat(priceSummary?.discount?.value)) / 100;
				discount = (subTotal * parseFloat(priceSummary?.discount?.value)) / 100;
			} else {
				balance = subTotal - parseFloat(priceSummary?.discount?.value);
				discount = parseFloat(priceSummary?.discount?.value);
			}
		}

		if (priceSummary?.tax?.value) {
			if (priceSummary?.tax?.type) {
				balance =
					balance + (balance * parseFloat(priceSummary?.tax?.value)) / 100;
				tax = (balance * parseFloat(priceSummary?.tax?.value)) / 100;
			} else {
				balance = balance + parseFloat(priceSummary?.tax?.value);
				tax = parseFloat(priceSummary?.tax?.value);
			}
		}

		if (priceSummary?.shipping?.value) {
			if (priceSummary?.shipping?.type) {
				// discount in percentage
				balance =
					balance + (balance * parseFloat(priceSummary?.shipping?.value)) / 100;
				shippingCharge =
					(balance * parseFloat(priceSummary?.shipping?.value)) / 100;
			} else {
				balance = balance + parseFloat(priceSummary?.shipping?.value);
				shippingCharge = parseFloat(priceSummary?.shipping?.value);
			}
		}
	}

	var balanceDue = balance;
	if (data?.amtPaidValue) {
		balanceDue = balanceDue - parseFloat(data?.amtPaidValue);
	}

	const [showModal, setShowModal] = useState(false);
	function handleHistory(e) {
		e.preventDefault();
		setShowModal(true);
	}

	const handleClose = () => setShowModal(false);

	const [invoiceNumber, setInvoiceNumber] = useState(1);

	const { history } = router?.query;
	const [prevData, setPrevData] = useState([]);
	useEffect(() => {
		const savedData = localStorage.getItem("saveData");
		if (savedData) {
			let items = JSON.parse(savedData);
			let length = items?.length;
			setInvoiceNumber(length + 1);
			// if (history) {
			setPrevData(items);
			// }
			if (history) {
				const data = items[history];
				if (data) {
					setData(data?.data);
					setBase64Data(data?.base64Data);
					setDate(new Date(data?.date));
					setDueDate(new Date(data?.dueDate));
					setMultipleInputData(data?.mulitpleInputData);
					setNumberInput(data?.numberInput);
					setPriceSummary(data?.priceSummary);
					setSelectedCurrency(data?.selectedCurrency);
					setInvoiceNumber(data?.invoiceNumber);
					setShowModal(false);
				} else {
					router?.push("/");
				}
			}
		}
	}, [history && history]);

	function handleRouting(e, index) {
		e.preventDefault();
		router.push("/" + index);
	}

	const saveData = {
		invoiceNumber: invoiceNumber,
		data: data,
		base64Data: base64Data,
		date: getDate(date),
		dueDate: getDate(dueDate),
		mulitpleInputData: mulitpleInputData,
		numberInput: numberInput,
		priceSummary: priceSummary,
		selectedCurrency: selectedCurrency,
		subTotal: subTotal,
		balance: balance,
		balanceDue: balanceDue,
		discount: discount,
		tax: tax,
		shippingCharge: shippingCharge,
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			// Trigger the click event on the desired button
			// Here, we're triggering the click event on the first button (index 0)
		}
	};

	const [textareaHeight, setTextareaHeight] = useState({
		notesValue: null,
		termsValue: null,
	});

	let notesHeight = 70;
	let termsHeight = 70;
	if (textareaHeight?.notesValue > 70) notesHeight = textareaHeight?.notesValue;
	if (textareaHeight?.termsValue > 70) termsHeight = textareaHeight?.termsValue;

	function handleTextareaChange(e) {
		e.preventDefault();
		const { name, value } = e.target;
		setData((prevState) => ({ ...prevState, [name]: value }));
		setTextareaHeight((prevState) => ({
			...prevState,
			[name]: e.target.scrollHeight,
		}));
	}

	return (
		<>
			<form onSubmit={formHandler} className={styles["invoice-form"]}>
				<div className="row">
					<div className="col-md-10 mb-5" id="form">
						<div className="bg-white">
							<div className="row p-4 mt-3">
								<div className={"col-md-6 my-auto " + styles["column1"]}>
									<ImageUpload
										base64Data={base64Data}
										setBase64Data={setBase64Data}
									/>
								</div>
								<div className={"col-md-6 text-md-end " + styles["column2"]}>
									<h1>INVOICE</h1>
									<div
										className={"input-group mb-3 " + styles["form-input-sm"]}
									>
										<span
											className={"input-group-text rounded-start"}
											id="basic-addon1"
										>
											#
										</span>
										<input
											type="text"
											className="form-control"
											placeholder="1"
											value={invoiceNumber}
											onChange={(e) => setInvoiceNumber(e.target.value)}
											onKeyDown={handleKeyPress}
											maxLength={"20"}
										/>
									</div>
								</div>

								<div className={"col-md-6 " + styles["column3"]}>
									<div className="mt-3">
										{/* <input
                      type="text"
                      placeholder="*Who is this invoice from?"
                      className={"form-control " + styles["form-input"]}
                      name="invoiceFrom"
                      onChange={handleChange}
                      onKeyDown={handleKeyPress}
                      value={data.invoiceFrom}
                      required
                    /> */}
										<textarea
											name="invoiceFrom"
											className={"form-control " + styles["form-input"]}
											onChange={handleChange}
											placeholder="*Who is this invoice from?"
											value={data.invoiceFrom}
										></textarea>
									</div>
									<div className="row mt-3">
										<div className="col-md-6">
											<input
												type="text"
												className={
													"text-muted form-control mb-1 w-75 " +
													styles["inputHeading"]
												}
												placeholder="Bill To"
												name="billTo"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.billTo}
												required
											/>
											{/* <input
                        type="text"
                        className={"form-control mb-3 " + styles["form-input-small"]}
                        placeholder="*Who is this invoice to?"
                        name="billToValue"
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        value={data.billToValue}
                        required
                      /> */}
											<textarea
												name="billToValue"
												className={"form-control pb-3"}
												onChange={handleChange}
												placeholder="*Who is this invoice to?"
												value={data.billToValue}
											></textarea>
										</div>
										<div className="col-md-6">
											<input
												type="text"
												className={
													"text-muted form-control mb-1 w-75 " +
													styles["inputHeading"]
												}
												placeholder="Ship To"
												name="shipTo"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.shipTo}
												required
											/>
											{/* <input
                        type="text"
                        className={"form-control mb-3 " + styles["form-input-small"]}
                        placeholder="(optional)"
                        name="shipToValue"
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        value={data.shipToValue}
                      /> */}
											<textarea
												name="shipToValue"
												className={"form-control pb-3"}
												onChange={handleChange}
												placeholder="(optional)"
												value={data.shipToValue}
											></textarea>
										</div>
									</div>
								</div>

								<div className={"col-md-6 text-md-end " + styles["column4"]}>
									<div
										className="mt-3 d-flex align-items-center justify-content-end"
										style={{ gap: "5px" }}
									>
										<div className={styles["text"]}>
											<input
												type="text"
												className={
													styles["inputHeading"] + " form-control text-end"
												}
												name="date"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.date}
											/>
										</div>
										<div className={styles["dateInput"]}>
											<div>
												<DatePicker setDate={setDate} date={date} />
											</div>
										</div>
									</div>

									<div
										className="mt-2 d-flex align-items-center justify-content-end"
										style={{ gap: "5px" }}
									>
										<div className={styles["text"]}>
											<input
												type="text"
												className={
													styles["inputHeading"] + " form-control text-end"
												}
												name="payTerms"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.payTerms}
											/>
										</div>
										<div className={styles["dateInput"]}>
											<input
												type="text"
												className={"form-control " + styles["form-input-sm2"]}
												name="payTermsValue"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.payTermsValue}
											/>
										</div>
									</div>

									<div
										className="mt-2 d-flex align-items-center justify-content-end"
										style={{ gap: "5px" }}
									>
										<div className={styles["text"]}>
											<input
												type="text"
												className={
													styles["inputHeading"] + " form-control text-end"
												}
												name="dueDate"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.dueDate}
											/>
										</div>
										<div className={styles["dateInput"]}>
											<div>
												<DatePicker setDate={setDueDate} date={dueDate} />
											</div>
										</div>
									</div>

									<PoNumber data={numberInput} setData={setNumberInput} />
								</div>
							</div>

							<div className="p-4">
								<MultipleInput
									data={mulitpleInputData}
									setData={setMultipleInputData}
									currency={selectedCurrency}
								/>

								<div className="mt-3 pt-3">
									<div className="row">
										<div className="col-md-6">
											<input
												type="text"
												className={
													"text-muted form-control mb-1 w-25 " +
													styles["inputHeading"]
												}
												placeholder="Notes"
												name="notes"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.notes}
											/>
											<textarea
												className="form-control mb-3"
												placeholder="Notes - any relevant information not already covered"
												name="notesValue"
												onChange={handleTextareaChange}
												value={data.notesValue}
												style={{ height: notesHeight }}
											></textarea>

											<input
												type="text"
												className={
													"text-muted form-control mb-1 w-25 " +
													styles["inputHeading"]
												}
												placeholder="Terms"
												name="terms"
												onChange={handleChange}
												onKeyDown={handleKeyPress}
												value={data.terms}
											/>
											<textarea
												className="form-control"
												placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
												name="termsValue"
												onChange={handleTextareaChange}
												value={data.termsValue}
												style={{ height: termsHeight }}
											></textarea>
										</div>
										<div className={"col-md-6 float-end " + styles["column6"]}>
											<div
												className="mt-2 d-flex align-items-center justify-content-end"
												style={{ gap: "13px" }}
											>
												<input
													type="text"
													className={
														"text-muted text-end form-control mb-1 w-75 " +
														styles["inputHeading"]
													}
													placeholder="Subtotal"
													name="subtotal"
													onChange={handleChange}
													onKeyDown={handleKeyPress}
													value={data.subtotal}
													required
												/>
												<div className={styles["form-input-sm2"] + " text-end"}>
													<div>
														{selectedCurrency}
														{subTotal?.toFixed(2) || 0}
													</div>
												</div>
											</div>

											<PriceSummary
												data={priceSummary}
												setData={setPriceSummary}
												currency={selectedCurrency}
											/>

											<div
												className="mt-2 d-flex align-items-center justify-content-end"
												style={{ gap: "13px" }}
											>
												<input
													type="text"
													className={
														"text-muted text-end form-control mb-1 w-75 " +
														styles["inputHeading"]
													}
													name="total"
													onChange={handleChange}
													onKeyDown={handleKeyPress}
													value={data.total}
													required
												/>

												{/* <div>
                              <input type="text" className={"form-control "} />
                            </div> */}
												<div className={styles["form-input-sm2"] + " text-end"}>
													<div>
														{selectedCurrency}
														{balance?.toFixed(2) || 0}
													</div>
												</div>
											</div>

											<div
												className="mt-2 d-flex align-items-center justify-content-end"
												style={{ gap: "13px" }}
											>
												<input
													type="text"
													className={
														"text-muted text-end form-control mb-1 w-75 " +
														styles["inputHeading"]
													}
													placeholder="Amount Paid"
													name="amtPaid"
													onChange={handleChange}
													onKeyDown={handleKeyPress}
													value={data?.amtPaid}
													required
												/>

												<div className="position-relative">
													<input
														type="number"
														className={"form-control " + styles["amountPaid"]}
														name="amtPaidValue"
														onChange={handleChange}
														onKeyDown={handleKeyPress}
														value={data.amtPaidValue}
													/>
													<span className={styles.amountPaidLabel}>
														{selectedCurrency}
													</span>
												</div>
												{/* <div className={styles["form-input-sm2"]+" text-end"}>
                              <div>$0.00</div>
                            </div> */}
											</div>

											<div
												className="mt-2 d-flex align-items-center justify-content-end"
												style={{ gap: "13px" }}
											>
												<input
													type="text"
													className={
														"text-muted text-end form-control mb-1 w-75 " +
														styles["inputHeading"]
													}
													placeholder="Balance Due"
													name="balDue"
													onChange={handleChange}
													onKeyDown={handleKeyPress}
													value={data.balDue}
													required
												/>

												{/* <div>
                              <input type="text" className={"form-control "} />
                            </div> */}
												<div className={styles["form-input-sm2"] + " text-end"}>
													<div>
														{selectedCurrency}
														{balanceDue?.toFixed(2) || 0}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-md-2">
						<div className="mt-3 text-center">
							<button className="btn btn-success text-white ">
								Download Invoice
							</button>
						</div>
						<div className="mt-4 ms-3">
							<small className="mb-2 fw-bold">CURRENCY</small>
							<select
								className="form-select form-select-sm bg-light"
								value={selectedCurrency}
								onChange={(e) => setSelectedCurrency(e.target.value)}
							>
								{currencyDataList?.map((item, index) => {
									let symbol = item?.currency?.symbol;
									if (symbol == "false") {
										symbol = JSON.parse(item?.currency?.symbol);
									}
									return (
										<option value={item?.currency?.symbol} key={index}>
											{`${item?.currency?.code} ${symbol && symbol}`}
										</option>
									);
								})}
							</select>
						</div>

						<div className="mt-4">
							<div className="mt-3 text-center">
								{prevData?.length > 0 && (
									<button
										className="btn btn-success text-white "
										onClick={handleHistory}
									>
										Invoice History
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</form>
			<PrintTemplate
				data={data}
				base64Data={base64Data}
				date={date}
				dueDate={dueDate}
				mulitpleInputData={mulitpleInputData}
				numberInput={numberInput}
				priceSummary={priceSummary}
				selectedCurrency={selectedCurrency}
				subTotal={subTotal}
				balance={balance}
				balanceDue={balanceDue}
				discount={discount}
				tax={tax}
				shippingCharge={shippingCharge}
			/>

			<Modal
				show={showModal}
				onHide={handleClose}
				centered
				size="lg"
				scrollable
			>
				<Modal.Header closeButton>
					<Modal.Title>Your Invoice History</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{prevData ? (
						<div className="row">
							{prevData?.map((item, index) => (
								<div className="col-12 border-bottom" key={index}>
									<PrintTemplate
										data={item?.data}
										base64Data={item?.base64Data}
										date={new Date(item?.date)}
										dueDate={new Date(item?.dueDate)}
										mulitpleInputData={item?.mulitpleInputData}
										numberInput={item?.numberInput}
										priceSummary={item?.priceSummary}
										selectedCurrency={item?.selectedCurrency}
										subTotal={item?.subTotal}
										balance={item?.balance}
										balanceDue={item?.balanceDue}
										discount={item?.discount}
										tax={item?.tax}
										shippingCharge={item?.shippingCharge}
										history={true}
									/>
									<div className="text-end">
										<button
											className="btn btn-success btn-sm mb-5 px-4 text-white"
											onClick={(e) => handleRouting(e, index)}
										>
											Edit
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						"No Data Found"
					)}
				</Modal.Body>
			</Modal>

			{/* template */}
		</>
	);
}
