import { useRouter } from "next/navigation";
import { useState } from "react";

export const NotebookList = ({ notebooks }: {
  notebooks: any[]
}
) => {

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const router = useRouter();

  const handleBookClick = (e: React.MouseEvent<HTMLElement>) => {
    setIsDisabled(true);
    const id_of_book = (e.target as unknown as HTMLElement).id;
    router.push(`/app/book/${id_of_book}`);
  }

  return (
    <div className="flex flex-col justify-center items-center w-full p-2 gap-2">
      {
        notebooks.map(
          (notebook) => {
            return (
              <div
                id={notebook._id}
                key={notebook._id}
                className={`p-4 pl-6 pr-6 bg-slate-800 rounded-2xl w-full md:w-1/2 md:self-center ${isDisabled ? ("cursor-not-allowed") : ("cursor-pointer")}`}
                onClick={(e) => {
                  if (isDisabled) return;
                  handleBookClick(e);
                }}
              >
                <span className="text-xl">{notebook.name}</span>
                <br />
                <span
                  className="text-slate-400"
                >
                  bal:
                  <span
                    className={`${(notebook.balance <= 0) ? ("text-red-500") : ("text-green-500")}`}>
                    {" " + notebook.balance}
                  </span>
                </span>
                <div className="flex justify-between pl-6 pr-6">
                  <button className="underline text-blue-200 cursor-pointer">
                    update
                  </button>
                  <button className="underline text-red-400 cursor-pointer">
                    delete
                  </button>
                </div>
              </div>
            )
          }
        )
      }
    </div>
  );
}