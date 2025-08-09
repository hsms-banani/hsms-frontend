'use client';

import { useState } from 'react';
import { ChevronRight, Clock, MapPin, Book, Heart, User, Cross, Lightbulb, Target, Globe, BookOpen, Landmark } from 'lucide-react';
import Image from 'next/image';

// Define the content type
type AboutContent = {
  id: string;
  title: string;
  icon: React.ReactNode;
  shortContent: string;
  fullContent: string;
  image?: string;
};

// Seminary-specific content
const aboutContents: AboutContent[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: <Book className="h-5 w-5" />,
    shortContent: 'Holy Spirit Major Seminary is a center of theological excellence dedicated to the formation of priests and lay leaders. Founded on the principles of profound spiritual growth and rigorous intellectual tradition, we have been forming servants of the Church for over 75 years.',
    fullContent: 'Holy Spirit Major Seminary is a center of theological excellence dedicated to the formation of priests and lay leaders. Founded on the principles of profound spiritual growth and rigorous intellectual tradition, we have been forming servants of the Church for over 75 years. Our comprehensive approach to formation ensures that students develop intellectually, spiritually, pastorally, and humanly in accordance with Church teachings. With a prayerful environment, distinguished faculty, and a curriculum that integrates classical wisdom with contemporary challenges, Holy Spirit Seminary provides a sacred space where vocations are discerned, faith is deepened, and theological understanding is cultivated. We prepare our seminarians and students not only for ministry and service but for a lifelong journey of faith and intellectual inquiry.',
    image: '/images/seminary-overview.jpg'
  },
  {
    id: 'history',
    title: 'Our History',
    icon: <Clock className="h-5 w-5" />,
    shortContent: 'The journey of Holy Spirit Major Seminary began in 1948 with a small community of twelve seminarians and three priest-professors. What started as a modest diocesan seminary has now evolved into one of the nation\'s most respected theological institutions.',
    fullContent: 'The journey of Holy Spirit Major Seminary began in 1948 with a small community of twelve seminarians and three priest-professors. What started as a modest diocesan seminary has now evolved into one of the nation\'s most respected theological institutions. Through the decades, we have remained faithful to our founding charism while adapting to the Church\'s evolving needs. The seminary expanded significantly following the Second Vatican Council, embracing renewal while preserving essential traditions. In 1975, we opened our theological studies to qualified lay students, enriching our academic community. By 1990, our library had become a renowned theological resource center in the region. In 2010, we received pontifical affiliation, allowing us to confer ecclesiastical degrees. Today, Holy Spirit Seminary stands as a beacon of theological education, with thousands of alumni serving the Church worldwide as priests, religious, theologians, and pastoral leaders.',
    image: '/images/seminary-history.jpg'
  },
  {
    id: 'spiritual-formation',
    title: 'Spiritual Formation',
    icon: <Cross className="h-5 w-5" />,
    shortContent: 'At the heart of our seminary is spiritual formation. We nurture the spiritual life of each seminarian through daily liturgy, communal and personal prayer, spiritual direction, and regular retreats, fostering a deep relationship with Christ.',
    fullContent: 'At the heart of our seminary is spiritual formation. We nurture the spiritual life of each seminarian through daily liturgy, communal and personal prayer, spiritual direction, and regular retreats, fostering a deep relationship with Christ. Spiritual formation at Holy Spirit Seminary is grounded in the rich traditions of Catholic spirituality, with special emphasis on contemplative prayer and discernment. Each seminarian is assigned a spiritual director who accompanies them on their vocational journey. Our liturgical life centers around the daily celebration of the Eucharist and the Liturgy of the Hours, creating a rhythm of prayer that sustains our community. Seasonal retreats provide opportunities for deeper reflection and spiritual renewal. We believe that authentic theological study flows from and leads back to prayer, as expressed in the ancient principle of "lex orandi, lex credendi" (the law of praying is the law of believing).',
    image: '/images/spiritual-formation.jpg'
  },
  {
    id: 'academics',
    title: 'Academic Programs',
    icon: <BookOpen className="h-5 w-5" />,
    shortContent: 'Our rigorous academic curriculum integrates philosophy, theology, scripture, and pastoral studies. We offer programs leading to the Bachelor of Philosophy, Master of Divinity, and various theological degrees in affiliation with pontifical universities.',
    fullContent: 'Our rigorous academic curriculum integrates philosophy, theology, scripture, and pastoral studies. We offer programs leading to the Bachelor of Philosophy, Master of Divinity, and various theological degrees in affiliation with pontifical universities. The academic journey at Holy Spirit Seminary begins with philosophical studies, establishing a solid intellectual foundation for theological inquiry. Our theology curriculum is comprehensive, covering systematic theology, moral theology, liturgy, canon law, Church history, sacred scripture, and pastoral theology. We employ a methodology that honors both the wisdom of tradition and the demands of contemporary contexts. Our faculty members are accomplished theologians and experienced pastors who combine scholarly expertise with lived faith. The seminary\'s academic year includes regular symposia, guest lectures, and theological conferences that expose students to diverse perspectives within the Catholic intellectual tradition.',
    image: '/images/seminary-academics.jpg'
  },
  {
    id: 'mission',
    title: 'Our Mission',
    icon: <Target className="h-5 w-5" />,
    shortContent: 'To form priests and lay leaders who are intellectually prepared, spiritually mature, and pastorally effective, capable of proclaiming the Gospel with fidelity and addressing contemporary challenges with wisdom and compassion.',
    fullContent: 'To form priests and lay leaders who are intellectually prepared, spiritually mature, and pastorally effective, capable of proclaiming the Gospel with fidelity and addressing contemporary challenges with wisdom and compassion. We accomplish this by providing an integrated program of human, spiritual, intellectual, and pastoral formation according to the Church\'s vision for priestly preparation. Our mission encompasses not only the formation of future priests but also the theological education of religious and lay students who seek to serve the Church in various capacities. We are committed to forming men and women who think with the Church (sentire cum Ecclesia) while engaging thoughtfully with the world. Our approach emphasizes both fidelity to the Magisterium and intellectual rigor, recognizing that authentic Catholic theology serves both the pursuit of truth and the building up of the Church.',
    image: '/images/seminary-mission.jpg'
  },
  {
    id: 'philosophy',
    title: 'Philosophical Studies',
    icon: <Lightbulb className="h-5 w-5" />,
    shortContent: 'Philosophy provides the essential conceptual foundation for theological studies. Our philosophical curriculum embraces both classical wisdom and contemporary thought, with particular attention to metaphysics, epistemology, ethics, and the philosophy of religion.',
    fullContent: 'Philosophy provides the essential conceptual foundation for theological studies. Our philosophical curriculum embraces both classical wisdom and contemporary thought, with particular attention to metaphysics, epistemology, ethics, and the philosophy of religion. Following the Church\'s recommendation, we emphasize the perennial philosophy of St. Thomas Aquinas while engaging constructively with modern and postmodern philosophical currents. Students develop critical thinking skills through rigorous logical analysis and the close reading of philosophical texts from Plato and Aristotle to contemporary philosophers. Special emphasis is given to philosophical anthropology and natural theology as bridges to formal theological study. Our philosophy faculty guides students in recognizing how philosophical questions about truth, goodness, beauty, and being prepare the mind for the reception of revealed truth. Through this philosophical formation, students acquire intellectual habits that serve them throughout their theological studies and ministerial careers.',
    image: '/images/philosophical-studies.jpg'
  },
  {
    id: 'campus',
    title: 'Our Campus',
    icon: <MapPin className="h-5 w-5" />,
    shortContent: 'Our seminary is situated on 40 acres of peaceful grounds, providing an environment conducive to prayer, study, and community life. The campus includes our chapel, residence halls, classrooms, library, and contemplative gardens.',
    fullContent: 'Our seminary is situated on 40 acres of peaceful grounds, providing an environment conducive to prayer, study, and community life. The campus includes our chapel, residence halls, classrooms, library, and contemplative gardens. At the center of our campus stands the Chapel of the Holy Spirit, where the seminary community gathers daily for the Eucharist and the Liturgy of the Hours. Our theological library houses over 150,000 volumes and provides access to major theological databases and journals. Residential facilities accommodate both seminarians and faculty members who live in community. Academic buildings include well-equipped classrooms, seminar rooms, and lecture halls. The campus also features a refectory, recreational facilities, and guest accommodations. Several garden areas and a meditation path provide spaces for personal reflection and prayer. The entire campus environment is designed to foster the integration of spiritual, intellectual, and communal dimensions of seminary formation.',
    image: '/images/seminary-campus.jpg'
  },
  {
    id: 'traditions',
    title: 'Our Traditions',
    icon: <Landmark className="h-5 w-5" />,
    shortContent: 'Holy Spirit Seminary maintains cherished traditions that connect our community to the universal Church and our own institutional heritage. These include the annual Pentecost celebration, scholarly symposia, community pilgrimages, and various liturgical observances.',
    fullContent: 'Holy Spirit Seminary maintains cherished traditions that connect our community to the universal Church and our own institutional heritage. These include the annual Pentecost celebration, scholarly symposia, community pilgrimages, and various liturgical observances. As our patronal feast, Pentecost is celebrated with special solemnity, often including the ordination of deacons. The annual Augustine Lecture brings renowned theologians to address the seminary community. During Holy Week, seminarians participate in an intensive retreat culminating in the Sacred Triduum. The academic year begins with the Mass of the Holy Spirit, during which faculty members profess the Oath of Fidelity. Each December, we hold a Lessons and Carols service that has become a beloved tradition for the wider community. Our May Mary\'s Garden procession honors the Blessed Mother as seminarians prepare for summer ministry. These traditions, along with many daily customs, form the rhythm of seminary life and connect generations of Holy Spirit alumni through shared experience.',
    image: '/images/seminary-traditions.jpg'
  },
  {
    id: 'faculty',
    title: 'Our Faculty',
    icon: <User className="h-5 w-5" />,
    shortContent: 'Our distinguished faculty combines academic excellence with pastoral experience. Priests, religious, and lay professors work together to provide integrated formation that prepares students for effective ministry and theological leadership.',
    fullContent: 'Our distinguished faculty combines academic excellence with pastoral experience. Priests, religious, and lay professors work together to provide integrated formation that prepares students for effective ministry and theological leadership. Each faculty member holds advanced degrees in their field of specialization and contributes to theological scholarship through research and publication. Many have studied at renowned institutions such as the Pontifical Gregorian University, the Angelicum, the Catholic University of America, and other centers of theological learning. Beyond their academic credentials, our professors bring wealth of pastoral and ministerial experience to their teaching. Several are active in parish ministry, spiritual direction, and ecclesial service. Our faculty members see their role not merely as conveying information but as forming future shepherds and teachers of the faith. They serve as mentors, advisors, and spiritual companions to students, modeling the integration of intellectual rigor and lived faith that we seek to cultivate in those preparing for ministry.',
    image: '/images/seminary-faculty.jpg'
  },
  {
    id: 'community',
    title: 'Seminary Community',
    icon: <Heart className="h-5 w-5" />,
    shortContent: 'Seminary formation happens within a supportive community of faith. Our seminarians, faculty, and staff form a community of prayer, study, and fraternal charity that reflects the communion of the Church and prepares future priests for parish life.',
    fullContent: 'Seminary formation happens within a supportive community of faith. Our seminarians, faculty, and staff form a community of prayer, study, and fraternal charity that reflects the communion of the Church and prepares future priests for parish life. Community life at Holy Spirit Seminary is structured to foster both personal growth and fraternal bonds. Seminarians live in small residential groups called "fraternities," each guided by a formation advisor. These groups share regular meals, prayer times, and recreational activities. The entire seminary gathers daily for liturgy and meals, creating a rhythm of communal life. Throughout the year, community days provide opportunities for service projects, cultural outings, and sporting events. Formation in community helps future priests develop the interpersonal skills, emotional maturity, and capacity for collaboration essential for effective ministry. In our community, seminarians learn to balance personal prayer with communal worship, individual study with collaborative learning, and solitude with active participation in shared life – all crucial elements of priestly formation.',
    image: '/images/seminary-community.jpg'
  },
];

export function AboutUsSection() {
  const [activeContent, setActiveContent] = useState<AboutContent>(aboutContents[0]);
  const [showFullContent, setShowFullContent] = useState(false);

  return (
    <section className="py-16 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-stone-800 sm:text-4xl">About Holy Spirit Major Seminary</h2>
          <div className="mt-4 max-w-3xl mx-auto">
            <p className="text-lg text-stone-600">
              Forming faithful servants through spiritual, intellectual, human, and pastoral formation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-stone-200">
              <div className="px-6 py-4 bg-stone-800">
                <h3 className="text-lg font-semibold text-white">Explore</h3>
              </div>
              <nav className="divide-y divide-stone-200">
                {aboutContents.map((content) => (
                  <button
                    key={content.id}
                    onClick={() => {
                      setActiveContent(content);
                      setShowFullContent(false);
                    }}
                    className={`w-full flex items-center px-6 py-4 text-left hover:bg-amber-50 transition-colors ${
                      activeContent.id === content.id ? 'bg-amber-50 text-amber-900' : 'text-stone-700'
                    }`}
                  >
                    <span className={`mr-3 ${activeContent.id === content.id ? 'text-amber-700' : 'text-stone-500'}`}>
                      {content.icon}
                    </span>
                    <span className="font-medium">{content.title}</span>
                    {activeContent.id === content.id && (
                      <ChevronRight className="ml-auto h-5 w-5 text-amber-700" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-stone-200">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-stone-800 mb-4 flex items-center">
                  <span className="text-amber-700 mr-3">{activeContent.icon}</span>
                  {activeContent.title}
                </h3>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  {/* Image */}
                  {activeContent.image && (
                    <div className="md:w-1/3 h-64 relative rounded-lg overflow-hidden border border-stone-200">
                      <div className="absolute inset-0 bg-stone-200 animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-stone-500">
                        Image placeholder ({activeContent.id})
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className={activeContent.image ? 'md:w-2/3' : 'w-full'}>
                    <div className="prose max-w-none">
                      <p className="text-stone-700">
                        {showFullContent ? activeContent.fullContent : activeContent.shortContent}
                      </p>
                    </div>

                    {activeContent.shortContent !== activeContent.fullContent && (
                      <button
                        onClick={() => setShowFullContent(!showFullContent)}
                        className="mt-4 inline-flex items-center text-amber-700 hover:text-amber-900 font-medium transition-colors"
                      >
                        {showFullContent ? 'Show less' : 'Read more'}
                        <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${showFullContent ? 'rotate-90' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}