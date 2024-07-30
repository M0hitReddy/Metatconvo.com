import React, { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { Button } from './ui/button'
import axios from 'axios'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { } from '@radix-ui/react-avatar'
import { Checkbox } from './ui/checkbox'

function NewChatDialogOpen() {
    const [search, setSearch] = useState('');
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [map, setMap] = useState({});
    const handleCheckBoxChange = (result) => {
        setMap({ ...map, [result.id]: result.Username });
        setSelectedPeople(selectedPeople.includes(result.id) ? selectedPeople.filter((person) => person !== result.id) : [...selectedPeople, result.id]);
        setSearchResults(searchResults.map((person) => person.id === result.id ? { ...person, checked: !person.checked } : person));

    }

    useEffect(() => {
        // setSearch('')
        if (search === '') {
            setSearchResults([]);
            return;
        }
        async function fetchUsers() {
            const res = await axios.get(`http://localhost:5000/chats/users?search=${search}`);
            console.log(res.data);
            // setSearchResults(res.data);
            // setSearchResults(res.data.map((person) => ({ ...person, checked: selectedPeople.includes(person.id) })));
            console.log(selectedPeople.includes('933130e1-0b5e-44ee-8ac4-7461ab1a8935'));
            setSearchResults(res.data.map((person) => ({ ...person, checked: selectedPeople.includes(person.id) })));
        }
        fetchUsers();
        console.log(selectedPeople);
    }, [search]);

    useEffect(() => {
        console.log(map);
    }, [map]);
    return (
        // ((search !== '') ? '' :
        <DialogContent className="sm:max-w-[500px] p-0">
            <DialogHeader className={'flex flex-col gap-2 px-4 pt-4'}>
                <DialogTitle className='w-max m-auto'>New Chat</DialogTitle>
                <div className='flex items-center gap-2 flex-wrap'>
                    <p className='font-bold'>To : </p>
                    {/* <div className='flex gap-2'> */}
                    {selectedPeople.map((person) => (
                        <div key={person} className='relative flex items-center justify-between gap-1 bg-secondary text-primary p-2 rounded-full overflow-hidden '>
                            <Label key={person} className='max-w-40'>
                                {/* <p className='max-w-40 '> */}
                                {map[person]}
                                {/* </p> */}
                            </Label>
                            {/* <Button className="px-2 py-1 h-max bg-secondary rounded-full text-primary hover:bg-secondary" onClick={() => set sel}><X className="p-0 h-4 w-4" /></Button> */}
                        </div>
                    ))}
                    {/* </div> */}
                </div>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search person.." className="pl-8" onChange={(e) => setSearch(e.target.value)} />
                </div>
            </DialogHeader>
            <Separator />
            {(search === '') ?
                (<DialogDescription className="px-4 py-2 h-40">Search for people to start a chat with</DialogDescription>) :
                (searchResults.length === 0) ?
                    (<DialogDescription className="px-4 py-2 h-40">No users found</DialogDescription>) :
                    (< ScrollArea className="max-h-96 min-h-40 px-4">
                        <div className="grid gap-2 py4">
                            {searchResults.map((result) => (
                                <div key={result.id} className="space-x-2 border p-2 rounded-lg">

                                    <label
                                        htmlFor={'newchat' + result.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between items-center"
                                    >
                                        <div className='flex gap-2 items-center'>
                                            <Avatar>
                                                <AvatarImage src={result.ProfilePicture} alt="@shadcn" />
                                                {/* <img src={result.ProfilePicture} alt="" /> */}
                                                {/* <AvatarFallback>CN</AvatarFallback> */}
                                            </Avatar>
                                            <p>{result.Username}</p>
                                        </div>
                                        <Checkbox id={'newchat' + result.id} checked={result?.checked} onCheckedChange={() => handleCheckBoxChange(result)} />
                                    </label>
                                </div>
                            ))
                            }

                        </div>
                    </ScrollArea>)
            }
            {/* <Separator /> */}
            <DialogFooter className={'px-4 pb-4'}>
                <Button type="submit" variant="outline" className="border-primary w-full">Start Chat</Button>
            </DialogFooter>
        </DialogContent>
    )


}

export default NewChatDialogOpen;