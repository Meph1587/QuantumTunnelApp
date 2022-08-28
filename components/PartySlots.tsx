
import TokenSelectModal from "./TokenSelectModal";

const PartySlots = ({traits, tokenIds, slot, setSlot, l1Id,  wizard, setWizard, t1, t2, wizardTraits }) => {
    console.log(traits)
    return(
        <div className="pl-4 pr-4 pt-2 text-left"> 
            <h3>Party: </h3>
            <div className="flex  overflow-scroll scrollbar h-36">
                <div className="flex p-2">
                {
                        traits.map((trait, idx) => (
                            <button key={idx} className="text-center w-20  ml-2 mr-2 mb-4" onClickCapture={()=> setSlot(idx)} >
                                <div className="border-solid border-2 border-gray-200 h-20">
                                {tokenIds[idx] < 10000 ? 
                                <button onClickCapture={()=> setWizard(tokenIds[idx] )} >
                                    <img
                                        src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + tokenIds[idx].toNumber() + ".png"}
                                        ></img> 
                                    </button>
                                : idx==slot && wizard ? 
                                    <TokenSelectModal  trigger={<button> 
                                        <img src={"https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-" + wizard + ".png"}
                                        ></img> 
                                    </button>}l1Id={l1Id} wizard={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2}></TokenSelectModal>
                                : 
                                <TokenSelectModal  trigger={<button className="hover:bg-gray-900 w-[100%] h-[100%]"></button>}l1Id={l1Id} wizard={wizard} setWizard={setWizard} wizardTraits={wizardTraits} t1={t1} t2={t2}></TokenSelectModal>
                                }
                                </div>
                                <p className="text-[9px] h-8">{trait}</p>
                            </button>
                        ))
                }
                </div>
            </div>
        </div>
    );
};
export default PartySlots;