
import { FineTuneDialog } from '@/components/modal'; 
import { useDisclosure } from '@chakra-ui/react'
import { IconVercel } from '@/components/ui/icons'

export function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  appDir: true; 


  return (
    <header className="sticky top-0 z-50 bg-gray-800 text-gray-300 items-center">
      <div className="">
        <div className="">
          <ul className="text-xs flex font-normal justify-center gap-x-7 lg:gap-14 p-2 ">
            <div className="w-5 lg:w-8">
            <li><a href="/" className="hover:text-blue-200 transition-colors duration-300"><img src="/shooketh.png" alt="Your description here" width="30" height="2" />
</a> </li>
            </div>
              <li className='flex items-center'><a href=" " onClick={(event) => { event.preventDefault(); onOpen(); }}>
                <IconVercel className="mr-2" />
                  <span className="hidden sm:block">Fine-Tune</span>
                    <span className="sm:hidden">Fine-Tune</span></a></li> 
                    <FineTuneDialog isOpen={isOpen} onClose={onClose} />



            <li className='flex items-center'><a href=" " className="hover:text-blue-200 transition-colors duration-300" onClick={(event) => { event.preventDefault(); onOpen(); }}>Models</a></li><FineTuneDialog isOpen={ isOpen} onClose={onClose} />
            <li className='flex items-center'><a href=" " className="hover:text-blue-200 transition-colors duration-300">Subscribe</a></li>
            <li className='flex items-center'><a href="/Fine-Tune" className="hover:text-blue-200 transition-colors duration-300">Fine-Tune</a></li>
          </ul>
          </div>
      </div>
    </header>
  );
}

export default Header;

