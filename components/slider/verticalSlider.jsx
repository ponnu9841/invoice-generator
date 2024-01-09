import React from "react";
import styles from "./slider.module.scss";

export default function VerticalSlider() {
	const gridRef = React.useRef(null);

	const [toggle, setToggle] = React.useState(false);

	return (
		<div className="container-fluid">
			<div className={`${styles.grid} ${toggle ? styles.open : ""} `}>
				<div>
					<button onClick={() => setToggle(!toggle)}>
						{!toggle ? ">" : "<"}
					</button>
				</div>
				<div>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem,
					laborum voluptatum facere perferendis doloribus ullam fugiat
					voluptatem tempore consequuntur obcaecati tempora excepturi, inventore
					consectetur cupiditate cum odio labore ratione dolor.
				</div>
				<div>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis
					optio eum natus voluptatum assumenda voluptas eaque, voluptate
					dignissimos impedit delectus quis dolores laborum tenetur! Quo sequi
					id delectus odio sint!
				</div>
			</div>
		</div>
	);
}
