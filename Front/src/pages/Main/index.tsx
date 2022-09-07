import { useEffect, useState } from "react";
import * as io from "socket.io-client";
import "./style.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
const exchangeImage = require("../../assets/Exchangeimage.jpg");

const socket = io.connect("http://localhost:4000");
socket.io.on("reconnect_error", (error) => {
  socket.disconnect();
});

interface Exchange {
  user_email: string;
  type: string;
  date: Date;
  GBP: number;
  USD: number;
}

function Main() {
  const navigate = useNavigate();
  const [exchangeValue, setExchangeValue] = useState({ GBP: 0, USD: 0 });
  const [exchangeType, setExchangeType] = useState("GBP to USD");
  const [exchangeHistory, setExchangeHistory] = useState<Exchange[]>([]);
  const [USDValue, setUSDValue] = useState(0);
  const [GBPValue, setGBPValue] = useState(0);
  const handleExchange = (e: any) => {
    e.preventDefault();
    socket.emit("exchange", {
      user_email: localStorage.getItem("email"),
      type: exchangeType,
      values: exchangeValue,
    });
  };
  useEffect(() => {
    if (!localStorage.getItem("email")) {
      navigate("/signin");
    }
  }, [navigate]);
  useEffect(() => {
    setTimeout(() => {
      socket.emit("main", localStorage.getItem("email"));
      socket.on("userHistory", (data) => {
        setExchangeHistory(data);
      });
    }, 200);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      socket.on("USDValue", (data: number) => {
        setUSDValue(data);
      });
      socket.on("GBPValue", (data: number) => {
        setGBPValue(data);
      });
    }, 200);
    socket.on(
      "exchangeReturn",
      (data: { GBP: number; USD: number; history: Exchange[] }) => {
        setExchangeHistory(data.history);
        setExchangeValue(data);
      }
    );
  });
  const changeExchangeType = () => {
    setExchangeValue({ GBP: 0, USD: 0 });
    exchangeType === "GBP to USD"
      ? setExchangeType("USD to GBP")
      : setExchangeType("GBP to USD");
  };
  const handleChangeInput = (event: any) => {
    const name = event.target.name;
    setExchangeValue({ ...exchangeValue, [name]: event.target.value });
  };
  const logout = () => {
    localStorage.clear();
    navigate("/signin");
  };
  return (
    <div className="container">
      <button className="logout" onClick={logout}>
        Logout
      </button>
      <div className="content">
        <img
          src={exchangeImage}
          alt="Exchange Logo"
          className="exchange-image"
        />
        <form className="exchange-card" onSubmit={(e) => handleExchange(e)}>
          <div className="values">
            <span className="current-value">
              {exchangeType === "USD to GBP" ? GBPValue || "" : USDValue || ""}
            </span>
            <span>1</span>
          </div>
          <div
            className={`inputs ${
              exchangeType === "USD to GBP" ? "usd-to-gbp" : ""
            }`}
            data-testid="labelValue"
          >
            <div className="gbp">
              <label htmlFor="GBP">GBP</label>
              <input
                onChange={(event) => handleChangeInput(event)}
                type="number"
                disabled={exchangeType === "GBP to USD" ? false : true}
                value={exchangeValue.GBP}
                name="GBP"
                id="GBP"
                step="0.01"
                min="0.01"
              ></input>
            </div>
            <div className="usd">
              <label htmlFor="USD">USD</label>
              <input
                onChange={(event) => handleChangeInput(event)}
                type="number"
                disabled={exchangeType === "USD to GBP" ? false : true}
                value={exchangeValue.USD}
                name="USD"
                id="USD"
                step="0.01"
                min="0.01"
              ></input>
            </div>
          </div>
          <div className="buttons">
            <button type="submit" className="btn-exchange">
              Exchange
            </button>
            <button
              type="button"
              onClick={changeExchangeType}
              className="btn-change-type"
              data-testid="changeTypeButton"
            >
              🔁 {exchangeType}
            </button>
          </div>

          {exchangeHistory.length > 0 && (
            <>
              <h1 className="h1-exchange-history">Exchange History</h1>
              <div className="history">
                {exchangeHistory.map((item: Exchange) => (
                  <div className="history-exchange" key={String(item.date)}>
                    <span className="type">Type of exchange: {item.type}</span>
                    {item.type === "GBP to USD" && (
                      <span className="gbp">GBP: {item.GBP}</span>
                    )}
                    <span className="usd">USD: {item.USD}</span>
                    {item.type === "USD to GBP" && (
                      <span className="gbp">GBP: {item.GBP}</span>
                    )}
                    <span className="date">
                      Date:{" "}
                      {format(new Date(item.date), "yyyy-MM-dd - hh:mm:ss aa")}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
export default Main;
