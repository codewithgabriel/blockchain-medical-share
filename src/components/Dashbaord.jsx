import CreatePatient from './CreatePatient';
import Header from './Header';
import { useState } from 'react';

export default function Dashbaord ()  { 

            return(
                <div className="flex flex-col w-full">
                    <Header />
                    <CreatePatient />
                </div>
            )
} 


