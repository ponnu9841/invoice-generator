import React from "react";
import styles from "./print.module.scss";
import parse from "html-react-parser";
export default function PrintTemplate(props) {
	const {
		data,
		base64Data,
		date,
		dueDate,
		mulitpleInputData,
		numberInput,
		priceSummary,
		selectedCurrency,
		subTotal,
		discount,
		tax,
		shippingCharge,
		balance,
		balanceDue,
		history,
	} = props;

	function getDate(date) {
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		const day = date.getDate();
		const month = months[date.getMonth()];
		const year = date.getFullYear();
		return `${month} ${day}, ${year}`;
	}

	return (
		<div
			className={["bg-white", !history && "size-a4 d-none"]
				.filter(Boolean)
				.join(" ")}
			id="printForm"
			style={{ width: "8.3in", height: "11.7in" }}
		>
			<div className={"p-3 pt-5 " + styles.printDiv}>
				<div className="row px-4">
					<div className="col-4">
						<img src={base64Data} alt="" className={styles.logo} />
					</div>
					<div className="col-8">
						<h1 className="text-end">INVOICE</h1>
						<div className="text-end">#1</div>
					</div>
				</div>

				<div className="row px-4">
					<div className={"col-md-4"}>
						<div className="mt-3">
							<p className={"fw-bold " + styles.textarea}>
								{parse(data?.invoiceFrom)}
							</p>
						</div>
						<div className="row mt-3">
							<div className="col-md-6">
								<p>{data?.billTo}</p>
								<p className={"fw-bold " + styles.textarea}>
									{data?.billToValue}
								</p>
							</div>
							<div className="col-md-6">
								<p>{data.shipTo}</p>
								<p className={"fw-bold " + styles.textarea}>
									{data.shipToValue}
								</p>
							</div>
						</div>
					</div>

					<div className="col-md-8 text-md-end">
						<div
							className="d-flex align-items-center justify-content-end"
							style={{ gap: "5px" }}
						>
							<div>
								<p className={styles.para}>{data.date}</p>
							</div>
							<div className={styles["dateInput2"]}>
								<p className={styles.para}>{getDate(date)}</p>
							</div>
						</div>

						<div
							className="d-flex align-items-center justify-content-end"
							style={{ gap: "5px" }}
						>
							<div className={styles["text"]}>
								<p className={styles.para}>{data?.payTerms}</p>
							</div>
							<div className={styles["dateInput2"]}>
								<p className={styles.para}>{data.payTermsValue}</p>
							</div>
						</div>

						<div
							className="d-flex align-items-center justify-content-end"
							style={{ gap: "5px" }}
						>
							<div className={styles["text"]}>
								<p className={styles.para}>{data.dueDate}</p>
							</div>
							<div className={styles["dateInput2"]}>
								<p className={styles.para}>{getDate(dueDate)}</p>
							</div>
						</div>

						{numberInput?.map((item, index) => (
							<div
								className="d-flex align-items-center justify-content-end"
								style={{ gap: "5px" }}
								key={index}
							>
								<div className={styles["text"]}>
									<p className="mb-2">{item?.name}</p>
								</div>
								<div className={styles["dateInput2"]}>
									<p className="mb-2">{item.value}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="px-4 mt-3" style={{ fontSize: "14px" }}>
					<div className="row bg-dark text-white rounded py-1 align-items-center">
						<div className="col-6">
							<div>Item</div>
						</div>
						<div className="col-6">
							<div className="row">
								<div className="col-5">Quantity</div>
								<div className="col-3">Rate</div>
								<div className="col-4 text-end">Amount</div>
							</div>
						</div>
					</div>

					{mulitpleInputData?.map((item, index) => (
						<div
							className="row rounded py-1 align-items-center"
							style={{ fontSize: "14px" }}
							key={index}
						>
							<div className="col-6">
								<div className="fw-bold text-wrap">
									<p className={"m-0 p-0 " + styles.textarea}>
										{item?.description}
									</p>
								</div>
							</div>
							<div className="col-6">
								<div className="row">
									<div className="col-5">{item?.quantity}</div>
									<div className="col-3">{item?.rate}</div>
									<div className="col-4 text-end">
										{selectedCurrency}
										{(item?.quantity * item?.rate).toFixed(2)}
									</div>
								</div>
							</div>
						</div>
					))}

					<div className="text-end mt-5">
						<div
							className="d-flex justify-content-end"
							style={{ fontSize: "14px" }}
						>
							<div>Subtotal:</div>
							<div className="text-end" style={{ width: "150px" }}>
								{selectedCurrency}
								{subTotal?.toFixed(2)}
							</div>
						</div>
						{discount ? (
							<div
								className="d-flex justify-content-end mt-2"
								style={{ fontSize: "14px" }}
							>
								<div>
									Discount{" "}
									{priceSummary?.discount?.type &&
										`(${priceSummary?.discount?.value}%)`}
									:
								</div>
								<div className="text-end" style={{ width: "150px" }}>
									{selectedCurrency}
									{discount?.toFixed(2)}
								</div>
							</div>
						) : null}
						{tax && tax != 0 ? (
							<div
								className="d-flex justify-content-end mt-2"
								style={{ fontSize: "14px" }}
							>
								<div>
									Tax{" "}
									{priceSummary?.tax?.type && `(${priceSummary?.tax?.value}%)`}:
								</div>
								<div className="text-end" style={{ width: "150px" }}>
									{selectedCurrency}
									{tax?.toFixed(2)}
								</div>
							</div>
						) : null}
						{shippingCharge && shippingCharge != 0 ? (
							<div
								className="d-flex justify-content-end mt-2"
								style={{ fontSize: "14px" }}
							>
								<div>
									Shipping{" "}
									{priceSummary?.shipping?.type &&
										`(${priceSummary?.shipping?.value}%)`}
									:
								</div>

								<div className="text-end" style={{ width: "150px" }}>
									{selectedCurrency}
									{shippingCharge?.toFixed(2)}
								</div>
							</div>
						) : null}

						{data?.amtPaidValue && data?.amtPaidValue != 0 ? (
							<div
								className="d-flex justify-content-end mt-2"
								style={{ fontSize: "14px" }}
							>
								<div>Amount Paid :</div>

								<div className="text-end" style={{ width: "150px" }}>
									{selectedCurrency}
									{data?.amtPaidValue}
								</div>
							</div>
						) : null}

						<div
							className="d-flex justify-content-end mt-2"
							style={{ fontSize: "14px" }}
						>
							<div>Balance:</div>

							<div className="text-end" style={{ width: "150px" }}>
								{selectedCurrency}
								{balanceDue?.toFixed(2)}
							</div>
						</div>
					</div>

					<div className="mt-4">
						{data?.notesValue && (
							<div>
								<p className="text-muted p-0 m-0">{data?.notes}</p>
								<p className={styles.textarea}>{data?.notesValue}</p>
							</div>
						)}

						{data?.termsValue && (
							<div>
								<p className="text-muted m-0 p-0">{data?.terms}</p>
								<p className={styles.textarea}>{data?.termsValue}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
