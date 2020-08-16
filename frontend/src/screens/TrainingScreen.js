import React, { useState } from 'react'
import NavBar from '../components/Navbar'
import { Link } from 'react-router-dom';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function TrainingScreen(props) {
    const [openOne, setOpenOne] = useState(false);
    const [openTwo, setOpenTwo] = useState(false);
    const [openThree, setOpenThree] = useState(false);
    const [openFour, setOpenFour] = useState(false);
    const [openFive, setOpenFive] = useState(false);
    const [openSix, setOpenSix] = useState(false);
    const [openSeven, setOpenSeven] = useState(false);
    const [openEight, setOpenEight] = useState(false);
    const [openNine, setOpenNine] = useState(false);

    return (
        <div className="training-screen">
            <NavBar></NavBar>
            <div className="training-container">
                <div className="training-content">
                    <ul>
                        <li>
                            <div className="training-title">
                                <img src="/characters/elise.png" 
                                alt="elise" className="training-title-img"></img>
                                <div>
                                    <h3>Phòng tập luyện</h3>
                                    <p>Đây là nơi để bạn làm quen với các
                                        thử thách trước khi tham vào trận chiến thực tế.
                                    </p>
                                    <p><i>Lưu ý: Trong chế độ này, điểm số sẽ không được tính vào điểm
                                        kinh nghiệm đạt được.</i></p>
                                </div>
                            </div>
                        </li>
                        <li className="training-level">
                            <div className="training-level-title">
                                <span>
                                    <img src="/chicken.png" alt="chicken" className="training-img"></img>
                                    <b>Thử thách cấp 1</b>
                                </span>
                                <div>
                                    <button className="training-btn-detail"
                                    onClick={() => setOpenOne(!openOne)}>
                                        {
                                            openOne 
                                            ? <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                                            : <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                        }
                                        &nbsp;Chi tiết</button>
                                    <Link className="training-btn-play" to="/train/1">
                                        Chơi thử
                                    </Link>
                                </div>
                            </div>
                            {
                                openOne &&
                                <div className="training-level-detail">
                                    Luật chơi: Tìm các cặp lá bài giống nhau trong 60 giây. Mỗi lần
                                    trả lời sai sẽ mất 01 trái tim, vượt qua thử thách chỉ với 
                                    30 trái tim.
                                </div>
                            }
                        </li>
                        <li className="training-level">
                            <div className="training-level-title">
                                <span>
                                    <img src="/mech-boom.png" alt="boom" className="training-img"></img>
                                    <b>Thử thách cấp 2</b>
                                </span>
                                <div>
                                    <button className="training-btn-detail"
                                    onClick={() => setOpenTwo(!openTwo)}>
                                        {
                                            openTwo 
                                            ? <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                                            : <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                        }
                                        &nbsp;Chi tiết</button>
                                    <Link className="training-btn-play" to="/train/2">
                                        Chơi thử
                                    </Link>
                                </div>
                            </div>
                            {
                                openTwo &&
                                <div className="training-level-detail">
                                    Luật chơi: Tìm giúp Mage, Hunter, Paladin các lá bài phép mà tụi Boom Bot đã
                                    đánh cắp, nếu bị chúng phát hiện sẽ phải tìm lại từ đầu. 
                                </div>
                            }
                        </li>
                        <li className="training-level">
                            <div className="training-level-title">
                                <span>
                                    <img src="/drboom.png" alt="drboom" className="training-img"></img>
                                    <b>Thử thách cấp 3</b>
                                </span>
                                <div>
                                    <button className="training-btn-detail"
                                    onClick={() => setOpenThree(!openThree)}>
                                        {
                                            openThree 
                                            ? <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                                            : <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                        }
                                        &nbsp;Chi tiết</button>
                                    <Link className="training-btn-play" to="/train/3">
                                        Chơi thử
                                    </Link>
                                </div>
                            </div>
                            {
                                openThree &&
                                <div className="training-level-detail">
                                    Luật chơi: Tiêu diệt Dr. Boom bằng 30 phát bắn, trong đó phải có tối thiểu
                                    9 phát bắn trúng liên tiếp.
                                </div>
                            }
                        </li>
                        <li className="training-level">
                            <div className="training-level-title">
                                <span>
                                    <img src="/character_teacher.png" alt="teacher" className="training-img"></img>
                                    <b>Thử thách cấp 4</b>
                                </span>
                                <div>
                                    <button className="training-btn-detail"
                                    onClick={() => setOpenFour(!openFour)}>
                                        {
                                            openFour 
                                            ? <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                                            : <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                        }
                                        &nbsp;Chi tiết</button>
                                    <Link className="training-btn-play" to="/train/4">
                                        Chơi thử
                                    </Link>
                                </div>
                            </div>
                            {
                                openFour &&
                                <div className="training-level-detail">
                                    Luật chơi: Bạn có 5 giây để ghi nhớ vị trí các lá bài và
                                    30 giây để tìm các cặp lá bài giống nhau.
                                </div>
                            }
                        </li>
                        <li className="training-level">
                            <div className="training-level-title">
                                <span>
                                    <img src="/mind_tech.png" alt="mind-tech" className="training-img"></img>
                                    <b>Thử thách cấp 5</b>
                                </span>
                                <div>
                                    <button className="training-btn-detail"
                                    onClick={() => setOpenFive(!openFive)}>
                                        {
                                            openFive 
                                            ? <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                                            : <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                        }
                                        &nbsp;Chi tiết</button>
                                    <Link className="training-btn-play" to="/train/5">
                                        Chơi thử
                                    </Link>
                                </div>
                            </div>
                            {
                                openFive &&
                                <div className="training-level-detail">
                                    Luật chơi: Thu thập các lá bài có chứa chỉ số Mana từ 1 tới 10 
                                    theo thứ tự nhỏ đến lớn.
                                </div>
                            }
                        </li>
                        <li className="training-level">
                            <div className="training-level-title">
                                <span>
                                    <img src="/monkey.png" alt="finley" className="training-img"></img>
                                    <b>Thử thách cấp 6</b>
                                </span>
                                <div>
                                    <button className="training-btn-detail"
                                    onClick={() => setOpenSix(!openSix)}>
                                        {
                                            openSix 
                                            ? <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                                            : <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                        }
                                        &nbsp;Chi tiết</button>
                                    <Link className="training-btn-play" to="/train/6">
                                        Chơi thử
                                    </Link>
                                </div>
                            </div>
                            {
                                openSix &&
                                <div className="training-level-detail">
                                    Luật chơi: Giúp chú ếch làm toán thông qua việc tính tổng chỉ
                                    số tấn công của 
                                    hai lá bài được lật.
                                </div>
                            }
                        </li>
                        <li className="training-level">
                            <div className="training-level-title">
                                <span>
                                    <img src="/character_men.png" alt="men" className="training-img"></img>
                                    <b>Thử thách cấp 7</b>
                                </span>
                                <div>
                                    <button className="training-btn-detail"
                                    onClick={() => setOpenSeven(!openSeven)}>
                                        {
                                            openSeven 
                                            ? <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                                            : <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                        }
                                        &nbsp;Chi tiết</button>
                                    <Link className="training-btn-play" to="/train/7">
                                        Chơi thử
                                    </Link>
                                </div>
                            </div>
                            {
                                openSeven &&
                                <div className="training-level-detail">
                                    Luật chơi: Trả lời câu hỏi về bức tranh bị làm mờ. Mở được nhiều 
                                    cặp lá bài giống nhau thì ảnh sẽ rõ nét hơn.
                                </div>
                            }
                        </li>
                        <li className="training-level">
                            <div className="training-level-title">
                                <span>
                                    <img src="/yasuo.png" alt="yasuo" className="training-img"></img>
                                    <b>Thử thách cấp 8</b>
                                </span>
                                <div>
                                    <button className="training-btn-detail"
                                    onClick={() => setOpenEight(!openEight)}>
                                        {
                                            openEight 
                                            ? <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                                            : <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                        }
                                        &nbsp;Chi tiết</button>
                                    <Link className="training-btn-play" to="/train/8">
                                        Chơi thử
                                    </Link>
                                </div>
                            </div>
                            {
                                openEight &&
                                <div className="training-level-detail">
                                    Luật chơi: Cố gắng tìm ra các cặp lá bài giống nhau trong bối 
                                    cảnh Yasuo sử dụng Hasagi để gây rối trận đấu.
                                </div>
                            }
                        </li>
                        <li className="training-level">
                            <div className="training-level-title">
                                <span>
                                    <img src="/character_final.png" alt="final" className="training-img"></img>
                                    <b>Thử thách cấp 9</b>
                                </span>
                                <div>
                                    <button className="training-btn-detail"
                                    onClick={() => setOpenNine(!openNine)}>
                                        {
                                            openNine 
                                            ? <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                                            : <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                        }
                                        &nbsp;Chi tiết</button>
                                    <Link className="training-btn-play" to="/train/9">
                                        Chơi thử
                                    </Link>
                                </div>
                            </div>
                            {
                                openNine &&
                                <div className="training-level-detail">
                                    Luật chơi: Tìm các cặp lá bài sao cho chỉ số Mana của chúng là
                                    nghiệm của phương trình bậc hai.
                                </div>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TrainingScreen;