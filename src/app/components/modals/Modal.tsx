interface ModalProps {
isOpen: boolean;
children: React.ReactNode
}

const Modal = (props:ModalProps) => { 
  return (
       <div
      className={` fixed left-0 top-0 z-50 flex h-screen w-screen flex-col bg-black/50 items-center justify-center overflow-hidden backdrop-blur-[20px] transition-all duration-300 ease-in-out  ${
        props.isOpen
          ? 'scale-120 pointer-events-auto -translate-y-[0%]  opacity-100'
          : 'pointer-events-none translate-y-[100%] scale-0 opacity-0'
      }`}>
        {props.children}
    </div>
  )
}
export default Modal