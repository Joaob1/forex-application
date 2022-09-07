import "./style.css";
export default function Error({ message }: { message: string }) {
  return (
    <div className="error">
      <span>{message}</span>
    </div>
  );
}
