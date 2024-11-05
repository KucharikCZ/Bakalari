import {useEffect,useState} from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import {AlertMessage} from "@/components/AlertMessage";
import Cookies from "js-cookie";

type Hour = {
    Id: number;
    Caption: string;
    BeginTime: string;
    EndTime: string;
}

type Atom = {
    HourId: number;
    GroupIds: string[];
    SubjectId: string;
    TeacherId: string;
    RoomId: string;
    CycleIds: string[];
    Change: null | string;
    HomeworkIds: string[];
    Homeworks: any[];
    Theme: string;
    Assistants: any[];
    Notice: string;
}

type Day = {
    Atoms: Atom[];
    DayOfWeek: number;
    Date: string;
    DayDescription: string;
    DayType: string;
}

type Subject = {
    Id: string;
    Abbrev: string;
    Name: string;
}

type Teacher = {
    Id: string;
    Abbrev: string;
    Name: string;
}

type Room = {
    Id: string;
    Abbrev: string;
    Name: string;
}

type Group = {
    Id: string;
    Abbrev: string;
    Name: string;
}

type TimetableData = {
    Hours: Hour[];
    Days: Day[];
    Subjects: Subject[];
    Teachers: Teacher[];
    Rooms: Room[];
    Groups: Group[];
}

async function fetchTimetableData():Promise<TimetableData>{
    const token = Cookies.get("auth_token");

    const res = await axios.get("https://bakalari.uhlarka.cz/api/3/timetable/permanent", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if(res.status !== 200){
        throw new Error("Chyba při načítání dat z API");
    }

    return res.data;
}

export default function TimetablePermanent(){
    const [data, setData] = useState<TimetableData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData(){
            try{
                const timetableData = await fetchTimetableData();
                setData(timetableData);
            }catch(e){
                setError("Chyba při načítání dat z API");
            }
        }

        loadData();
    },[]);

    if(error){
        AlertMessage("error",error);
    }

    if(!data){
        return <>Ahoj</>
    }

    return(
        <Layout>
            <div className="container mx-auto px-9">
                <div className="bg-secondary shadow-[1px_1px_10px_#00000033] rounded-xl mt-9">
                    <div className="p-6 text-slate-800 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"/>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"/>
                                    {data.Hours.map(hour => (
                                        <th key={hour.Id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <p className="text-2xl mb-2">{hour.Caption}</p>
                                            {hour.BeginTime} - {hour.EndTime}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.Days.map(day => (
                                    <tr key={day.DayOfWeek}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            <div className="rounded-full bg-sky-600 text-white text-center font-bold px-4 py-2 -rotate-90">
                                                {["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek"][day.DayOfWeek - 1]}
                                            </div>
                                        </td>
                                        {[...Array(data.Hours.length)].map((_, hourIndex) => {
                                            const atom = day.Atoms.find(a => a.HourId === hourIndex + 1);

                                            if(!atom) return <td key={hourIndex} className="px-6 py-4"></td>;

                                            const subjectAbbrev = data.Subjects.find(s => s.Id === atom.SubjectId)?.Abbrev || "nedefinovany";
                                            const teacherAbbrev = data.Teachers.find(t => t.Id === atom.TeacherId)?.Abbrev || "N/A";
                                            //const teacherName = data.Teachers.find(t => t.Id === atom.TeacherId)?.Name || "nedefinovany";
                                            const roomName = data.Rooms.find(r => r.Id === atom.RoomId)?.Abbrev || "nedefinovany";
                                            const groupName = data.Groups.find(g => g.Id === atom.GroupIds[0])?.Abbrev || "nedefinovany";
                                            const bgColor = hourIndex % 2 === 0? "bg-sky-300":"bg-sky-400";

                                            return(
                                                <td key={hourIndex} className={`px-6 py-4 transition duration-300 ${bgColor} text-white`}>
                                                    <p className="text-center text-3xl font-bold">{subjectAbbrev}</p>
                                                    <p className="text-center uppercase">{teacherAbbrev}</p>
                                                    <hr className="my-2 border-white"/>
                                                    <p className="text-center text-[12px]">{roomName} | {groupName}</p>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}