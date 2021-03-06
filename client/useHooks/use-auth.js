import React, { useState, useContext, useEffect, createContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const authContext = createContext();

export function ProvideAuth({ children }) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
	return useContext(authContext);
};

export const useAccess = ({ type, setUser, setSupport }) => {
	const access = [
		{
			type: "client",
			url: "/api/v1/clients-login",
			token: "token_client",
			setData: setUser,
			isLogin: "isLoginClient"
		},
		{
			type: "support",
			url: "/api/v1/supports-login",
			token: "token_support",
			setData: setSupport,
			isLogin: "isLoginSupport"
		}
	];
	const types = access.filter(i => type.includes(i.type));
	const { url, token, setData, isLogin } = types[0];
	return { url, token, setData, isLogin };
};

function useProvideAuth() {
	const [user, setUser] = useState(null);
	const [support, setSupport] = useState(null);
	const [isLoading, setLoading] = useState(true);

	const signin = async ({ dataForm, type }) => {
		const { url, token, setData, isLogin } = useAccess({
			type,
			setUser,
			setSupport
		});

		const response = await axios
			.post(url, dataForm)
			.then(res => {
				const expiresIn = new Date(
					new Date().getTime() + res.data.expires_in * 60 * 1000
				);
				Cookies.set(token, res.data.access_token, {
					expires: expiresIn
				});
				setData(isLogin);
			})
			.catch(error => {
				return error.response.data;
			});

		return response;
	};
	const signout = () => {
		Cookies.remove("token_client");
		setUser(false);
	};

	useEffect(() => {
		const clientCookie = Cookies.get("token_client");
		const supportCookie = Cookies.get("token_support");
		if (clientCookie) {
			setUser("isLoginClient");
			setLoading(false);
		} else {
			setUser(false);
			setLoading(false);
		}
		if (supportCookie) {
			setSupport("isLoginSupport");
			setLoading(false);
		} else {
			setSupport(false);
			setLoading(false);
		}
	}, []);
	return { user, support, signin, isLoading, signout };
}

export default useProvideAuth;
