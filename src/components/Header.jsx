import { Link } from "react-router-dom";
import { useState  , useEffect} from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
export default function Header ({setActiveComponent}) {
    const [state, setState] = useState(false)

    // Replace javascript:void(0) paths with your paths
    const navigation = [
        { title: "Create Patient Record", path: "/dashboard" },
        { title: "View Records", path: "/dashboard/viewrecords" },
        { title: "Authorize Accecss", path: "/dashboard/authorize" },
        // { title: "Pricing", path: "javascript:void(0)" }
    ]

    useEffect(() => {
        document.onclick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn")) setState(false);
        };
    }, [])

    function setActiveComponent(component) { 
        setActiveComponent(component);
    }

    return (
        <nav className={` bg-blue-950 text-white pb-5 md:text-sm ${state ? "shadow-lg rounded-xl border mx-2 mt-2 md:shadow-none md:border-none md:mx-2 md:mt-0" : ""}`}>
            <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
                <div className="flex items-center justify-between py-5 md:block">
                    <h3 className="text-2xl font-bold"> Blockchain Based eHealth System </h3>
                    <div className="md:hidden">
                        <button className="menu-btn text-gray-500 hover:text-gray-800"
                            onClick={() => setState(!state)}
                        >
                            {
                                state ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                </div>
                <div className={`flex-1 items-center mt-8 md:mt-0 md:flex ${state ? 'block' : 'hidden'} `}>
                    <ul className="justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0 ">
                        {
                            navigation.map((item, idx) => {
                                return (
                                    <li key={idx} className="text-white hover:text-blue-600">
                                        <Link to={ item.path} className="block">
                                            {item.title}
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className="flex-1 gap-x-6 items-center justify-end mt-6 py-3 md:flex md:space-y-0 md:mt-0">
                       
                           <ConnectWallet />
                    </div>
                </div>
            </div>
        </nav>
    )
}