import { useState } from "react";

import { useAuth } from "./use-auth";

export default type => {
	const auth = useAuth();
	let send = null;
	if (type === "client") {
		send = "clients@gmail.com";
	} else {
		send = "supports@gmail.com";
	}
	const [dataForm, setDataForm] = useState({
		email: send,
		password: "secret",
		error: ""
	});
	function handleChange(e) {
		setDataForm({ ...dataForm, [e.target.name]: e.target.value });
	}
	function handleSubmit(e) {
		e.preventDefault();
		auth.signin({ dataForm, type }).then(response => {
			if (response) {
				setDataForm({ ...dataForm, error: response.errors[0] });
			}
		});
	}
	const { error } = dataForm;
	return [handleSubmit, handleChange, error];
};
