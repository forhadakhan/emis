/**
* Calling from: ManageAcademicRecords.jsx/StudentAcademicRecords.jsx
* Calling to: 
*/

import React from 'react';


const AcademicRecordsFAQ = ({ setActiveComponent, breadcrumb, setReference }) => {

    return (<>

        <div class="accordion my-5" id="accordionFAQ">
            <h5><i className='bi bi-question-circle-fill px-1'></i>   FAQ   </h5>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        What is CH/GP/LG?
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                    <div class="accordion-body">
                        <ul>
                            <li>CH: Credit Hour(s)</li>
                            <li>GP: Grade Point(s)</li>
                            <li>LG: Letter Grade</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseOne">
                        Why CH/GP/LG is not appearing?
                    </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                    <div class="accordion-body">
                        CH/GP/LG may not appear if -
                        <ul>
                            <li>a course marked as 'non credit'.</li>
                            <li>a course is not marked as completed (running).</li>
                            <li>result not published for a course.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseOne">
                        How is the total CGPA counted?
                    </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                    <div class="accordion-body">
                        <em className='d-block p-2 border m-2'>CGPA = (Sum of (Credit Hours * Grade Points)) / (Total Credit Hours)</em>
                        CH/GP/LG may not inclued in total -
                        <ul>
                            <li>if you failed in a course or your GP/CH is less than 2.</li>
                            <li>if you are taking a non-credit course. </li>
                            <li>if your course is still running. </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </>);
};


export default AcademicRecordsFAQ;