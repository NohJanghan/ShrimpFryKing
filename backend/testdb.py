from db.DBservice import *
from db.entity import *

# print(db.signup_id('0'))
# False

# print(db.signup('0', '0', '0'))
# True

# print(len(db.get_news_list('recent', 1, 10, '0')))
# 1

# print(db.get_news_list('recent', 1, 10, '0')[0].title)
# [단독] ...

# print(db.create_comment(CreateCommentItem(1, '0', '0', 0, None), '0'))
# None

# print(db.get_news_list('recent', 1, 10, '0')[0].comment[0].author_id)
# 0

# print(db.update_comment(1, 0, None, 1, "", '0'))
# None

# print(db.get_news_list('recent', 1, 10, '0')[0].comment[0].like)
# 1

# print(db.update_news(1, 1, None, "0"))
# None

# print(db.get_news_list('recent', 1, 10, '0')[0].like)
# 1

exit(0)
try:
    db.create_news(CreateNewsItem(title='[단독]‘보석 끝판왕’ 김우빈, 톱게이 홍석천 만났다…‘보석함’ 전격 출연',
                        content="**배우 김우빈, '홍석천의 보석함' 출연\n  \n모델 데뷔 시절부터 인연\n  \n오랜 '홍석천 픽' 만남에 기대**\n  \n\n|  |\n| --- |\n|  |\n| 배우 김우빈. 에이엠엔터테인먼트 제공. |\n\n보석 끝판왕의 등장이다. ‘홍석천 PICK’으로 알려진 배우 김우빈이 ‘홍석천의 보석함’에 수납된다.\n  \n  \n17일 세계비즈앤스포츠월드\xa0취재 결과 김우빈은\xa0최근 인기 웹 예능\xa0‘홍석천의 보석함’에 출연해 촬영을 마쳤다. ‘홍석천의 보석함’은 2023년 11월 시작해 인기리에 세 번째 시즌을 이어가고 있다.\xa0“잘생긴 남자만 출연 가능”이라는 파격적인 조건을 내걸고 일명\xa0‘홍석천 픽’의 남성 게스트가 출연하는 토크쇼다.\n  \n  \n평소 친분이 있는 두 사람의 ‘예능 투샷’에 기대가 모인다. ‘어쩌다 사장2’, ‘콩 심은 데 콩 나고 팥 심은 데 팥 난다’ 등 예능을 통해 얼굴을\xa0비쳤지만, ‘홍석천의 보석함’은 그간의 예능과는 결이 다른 토크쇼다. 김우빈이 능청스러운 입담의 홍석천을 상대로 어떤 모습을 보여줄지\xa0관심사다.\n  \n  \n보석함은 눈에 띄는\xa0‘원석’을 발견하면 SNS를 팔로우하는 홍석천의 오랜 장기가 빛을 발한 프로그램. 예전부터 홍석천의 팔로잉 목록에 있는 ‘이미 스타가 된’ 출연자, 혹은 대중이 미처 알아보지 못한 연예계 원석을 발굴해 인지도를 높이기도 한다. 유망주뿐 아니라 일반인의 출연도 있었고, 오랜 연예계 생활로 친분이 있는 톱스타들도 출연해 어디서도 보지 못한 특별한 케미를 만든다.\n  \n\n|  |\n| --- |\n|  |\n| 유튜브 채널 모비딕 ‘경리단길 홍사장’ 영상 캡처. |\n\n홍석천과 김우빈의 친분은 방송을 통해서도 여러\xa0차례 언급되어 왔다.\xa0김우빈의 데뷔 시절부터 친분을 쌓아온 홍석천은 과거 한 유튜브 방송에서 만난 모델에게 “내 눈에 딱 걸리면 방송계로 확 끌어줄 수 있다.\xa0(그런 경우가)\xa0많이 있다”며 김우빈을 언급한 바 있다. “김우빈이\xa0모델 활동할 때 내가 그렇게 ‘연기해라’해서 지금 한류스타가 됐다”고 콕 집어 말하기도 했다.\n  \n\n|  |\n| --- |\n|  |\n| SBS ‘돌싱포맨’에 출연한 방송인 홍석천. SBS 방송화면 캡처. |\n\n지난해 말 SBS ‘돌싱포맨’에 출연한 홍석천은\xa0자신의\xa0‘보석라인’으로 현빈, 김우빈, 변우석, 황인엽, 유태오 등을 꼽았다. 보석의 조건으로는 “얼굴이\xa0잘생기고 훈훈해야 한다. 목소리가 좋고 매력적이어야 한다”는 명확한 기준을 밝힌 바 있다. 앞서 변우석, 유태오, 황인엽까지 출연을 마친 상황.\xa0‘보석 종결자’ 김우빈의 등장에 홍석천의 광대가 어디까지 치솟을지도 관전 포인트다.\n  \n  \n‘믿고 보는 대중픽’으로 인정받은 홍석천의 안목이다. 배우 김도훈으로 출발해 배우 정건주, 라이즈, 이수혁,\xa0이수혁 등이 게스트로 출연해 100만 회를 훌쩍 넘는\xa0조회\xa0수를 올렸으며, 특히 변우석(386만 회), 라이즈(269만 회), 스트레이 키즈 필릭스(271만 회), 스트레이 키즈 현진(206만 회)\xa0출연 영상이\xa0폭발적인 화제를 모았다.\xa0‘자타공인 대중픽’ 김우빈의\xa0조회\xa0수는 과연 얼마나 나올지도 기대를 모은다.\n  \n  \n지난해 넷플릭스 ‘무도 실무관’으로 대중과 만난 김우빈은 올해 넷플릭스 오리지널 시리즈\xa0‘다 이루어질지니’ 공개를 앞두고 있다.\xa0‘더 글로리’ 김은숙 작가의 복귀작이자 김우빈과 수지의 만남으로 화제를 모은 작품이다. 김우빈은 극 중 1000년 만에 깨어난 램프의 정령 지니 역으로 판타지 장르에 도전한다.",
                        url='https://m.entertain.naver.com/home/article/396/0000709497',
                        image_url=None, category='Entertainment',
                        brief="배우 김우빈이 홍석천의 웹 예능 '홍석천의 보석함'에 출연하여 촬영을 마쳤습니다.  모델 시절부터 친분을 쌓아온 두 사람의 만남으로, 김우빈의 솔직한 모습과 홍석천과의 케미스트리가 기대됩니다.  '홍석천 픽'으로 유명한 해당 프로그램에서 김우빈이 어떤 매력을 보여줄지 많은 관심이 집중되고 있습니다.",
                        author_id='0'), user_id='0')
except Exception as e:
    print(e)
try:
    ns = db.get_news_by_id(1, '0')
    if ns is not {}:
        print(ns.title)
        print(ns.content)
        print(ns.brief)
        print(ns.url)
        print(ns.image_url)
        print(ns.category)
        print(ns.author_id)
        print(ns.date)
        print(ns.like)
        print(ns.dislike)
        print(ns.opinion)
        # print(ns.comment[0].content)
except Exception as e:
    print(e)
