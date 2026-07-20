import "../../styles/modal.scss";

export default function Modal({
open,
onClose,
children
}: any) {

if (!open) return null;

return (

<div className="modal-overlay" onClick={onClose}>

<div
className="modal-content"
onClick={(e) => e.stopPropagation()}
>

<button className="close" onClick={onClose}>
✕
</button>

{children}

</div>

</div>

);

}