import toast from "react-hot-toast"

export const errorNotification = (msg: string) => {
  toast.error(
    msg,
    {
      style: {
        borderRadius: '10px',
        background: '#1d293d',
        color: '#fff',
      }
    }
  );
}


export const successNotification = (msg: string) => {
  toast.success(
    msg,
    {
      style: {
        borderRadius: '10px',
        background: '#1d293d',
        color: '#fff',
      }
    }
  );
}