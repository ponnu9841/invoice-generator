{data.map((val, i) => (
    <div className={"mb-2 " + styles["input-wrapper"]} key={i}>
        {/* <input
type="text"
name="description"
value={val.description}
onChange={(e) => handleChange(e, i)}
onKeyDown={handleKeyPress}
placeholder="Description of service of product"
className={"form-control flex-fill " + styles["inputDesc"]}
/> */}
        <textarea
            name="description"
            className={"form-control pb-3 " + styles["inputDesc"]}
            onChange={(e) => handleChange(e, i)}
            placeholder="Description of service of product"
            value={val.description}
        ></textarea>
        <input
            name="quantity"
            value={val.quantity}
            type="number"
            placeholder="Quantity"
            onChange={(e) => handleChange(e, i)}
            onKeyDown={handleKeyPress}
            className={"form-control " + styles["value"]}
        />
        <div className="d-inline position-relative">
            <input
                name="rate"
                type="number"
                value={val.rate}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={handleKeyPress}
                className={"form-control " + styles["rate"]}
            />
            <span className={styles["currency"]}>{currency}</span>
        </div>

        <div className={styles["value"] + " text-end pe-2"}>
            {currency}
            {data[i]["quantity"] * data[i]["rate"]}
        </div>

        {data?.length > 1 && i != 0 && (
            <button
                onClick={(e) => handleDelete(e, i)}
                className={styles["deleteButton"]}
            >
                <GrFormClose />
            </button>
        )}
    </div>
))}