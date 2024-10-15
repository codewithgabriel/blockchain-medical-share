export default function FormView({handleInput , authorizeUser}) {
    return (
      <div className="relative max-w-xs ">
        <h2> View Records</h2>
        <form action="#">
          <input
            type="text"
            placeholder="Enter Patient address"
            name="address"
            //   value={address}
            onChange={(e) => handleInput (e) }
            className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />
          <div className="mt-2 w-full">
            <button
              onClick={(e)=> authorizeUser (e) }
              className="w-full px-7 py-4 text-indigo-600 duration-150 bg-indigo-50 rounded-lg hover:bg-indigo-100 active:bg-indigo-200"
            >
              View Record
            </button>
          </div>
        </form>
      </div>
    );
  }