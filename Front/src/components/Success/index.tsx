import "./style.css";
export default function Success({ message }: { message: string }) {
  return (
    <div className="success">
      <span>{message}</span>
    </div>
  );
}
