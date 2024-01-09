import React, { useState } from "react";
import styles from "./datePicker.module.scss"
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePicker(props) {
  const {date, setDate} = props
  return (
    <ReactDatePicker
      selected={date}
      onChange={(date) => setDate(date)}
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      closeOnScroll={true}
      className={styles['datePicker']+" form-control"}
    />
  );
}
