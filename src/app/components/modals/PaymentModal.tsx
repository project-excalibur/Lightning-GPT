import Modal from "./Modal"

interface PaymentModalProps {
onClose: ()=>void
isOpen: boolean

}
const PaymentModal = (props: PaymentModalProps) =>{
  return
<Modal isOpen={props.isOpen}>
  <div></div>
  </Modal>
}