<?php
    require_once(dirname(__FILE__) . '/../../config/index.php');
    $YEAR = date("Y");
    $FOOTER = "
        <div class=\"footer\">
            <div class=\"container_left\">
                <h2>Byte Size Deals</h2>
                <table width=\"100%\">
                    <tr>
                        <td>{$SUPPORT_EMAIL}</td>
                    </tr>
                </table>
            </div>
            <div class=\"container_right\">
                <div class=\"rewards\">
                    <div class=\"rewards_title\">AWARD WINING</div>
                    <img src=\"{$API_ENDPOINT}/resource/image/rewards/1.png\" alt=\"\" srcset=\"\">
                    <img src=\"{$API_ENDPOINT}/resource/image/rewards/2.png\" alt=\"\" srcset=\"\">
                    <img src=\"{$API_ENDPOINT}/resource/image/rewards/3.png\" alt=\"\" srcset=\"\">
                    <img src=\"{$API_ENDPOINT}/resource/image/rewards/4.png\" alt=\"\" srcset=\"\">
                </div>
            </div>
            <div class=\"copy_right\">
                <b>Copyright&copy;$YEAR by bytesizedeals.co.uk</b>
            </div>
        </div>
    ";
?>