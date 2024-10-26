import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import SearchForm from '../../components/SearchForm';
import { FaBook, FaFilm, FaMusic, FaGamepad, FaFileAlt } from 'react-icons/fa'; // Importing FontAwesome icons

function WorkDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [workData, setWorkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSearchRequest, setUserSearchRequest] = useState('');

  useEffect(() => {
    async function fetchWork() {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/work?id=${encodeURIComponent(id)}`);
        const json = await response.json();
  
        // Log the entire response to the console
        console.log('Work Data:', json); // Prints the full JSON response
  
        setWorkData(json?.work); // Set the `work` object directly
      } catch (error) {
        console.error('Error fetching work:', error);
        setWorkData(null);
      } finally {
        setLoading(false);
      }
    }
  
    fetchWork();
  }, [id]);  

  const handleSearch = () => {
    if (userSearchRequest) {
      router.push({
        pathname: '/',
        query: { q: userSearchRequest, offset: 1, limit: 12 },
      });
    }
  };

  // Function to return an appropriate icon based on the material type
  const getMaterialIcon = (materialTypeGeneral) => {
    switch (materialTypeGeneral) {
      case 'Bøger':
        return <FaBook className="text-white text-6xl" />;
      case 'Film':
        return <FaFilm className="text-white text-6xl" />;
      case 'Musik':
        return <FaMusic className="text-white text-6xl" />;
      case 'Spil':
        return <FaGamepad className="text-white text-6xl" />;
      case 'Artikler':
        return <FaFileAlt className="text-white text-6xl" />;
      default:
        return <FaFileAlt className="text-white text-6xl" />; // Default icon
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-10">
          <p>Indlæser...</p>
        </div>
      </Layout>
    );
  }

  if (!workData) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-10">
          <p>Fejl ved indlæsning af data. ID: {id}</p>
        </div>
      </Layout>
    );
  }

  // Extracting data
  const title = workData.titles?.full?.[0] || 'Ukendt titel';
  const creator = workData.creators?.map((c) => c.display).join(', ') || 'Ukendt forfatter';
  const year = workData.workYear?.year || 'Ukendt år';
  const fictionNonfiction = workData.fictionNonfiction?.display || 'Ukendt kategori';
  const latestPublicationDate = workData.latestPublicationDate || 'Ukendt dato';
  const dk5Classification = workData.dk5MainEntry?.display || 'Ingen DK5 klassifikation';
  const materialTypes = workData.materialTypes
    ?.map((mt) => mt.materialTypeSpecific?.display)
    .join(', ') || 'Ukendt materiale';
  const genreAndForm = workData.genreAndForm?.join(', ') || 'Ukendt genre/form';
  const subjects = workData.subjects?.all?.map((s) => s.display).join(', ') || 'Ingen emner angivet';
  const languages = workData.mainLanguages?.map((l) => l.display).join(', ') || 'Ukendt sprog';
  const workTypes = workData.workTypes?.join(', ') || 'Ukendt værktype';
  const abstract = workData.abstract?.[0] || 'Ingen beskrivelse tilgængelig';
  const coverImage = workData.manifestations?.latest?.cover?.detail;
  const materialTypeGeneral = workData.materialTypes?.[0]?.materialTypeGeneral?.display || 'Ukendt materiale';

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search Bar */}
        <SearchForm
          userSearchRequest={userSearchRequest}
          setUserSearchRequest={setUserSearchRequest}
          onSearch={handleSearch}
        />

        <div className="flex flex-col md:flex-row mt-6">
          <div className="md:w-1/3 mb-6 md:mb-0">
            {coverImage ? (
              <img
                src={coverImage}
                alt={`Cover of ${title}`}
                className="w-full h-auto rounded-lg shadow-md"
              />
            ) : (
              <div className="relative flex items-center justify-center w-full h-64 bg-gray-300 rounded-lg shadow-md">
                {workData.workTypes?.[0] === 'LITERATURE' && (
                  <FaBook className="text-6xl text-gray-500"  title="Litteratur"/>
                )}
                {workData.workTypes?.[0] === 'MOVIE' && (
                  <FaFilm className="text-6xl text-gray-500"  title="Film"/>
                )}
                {workData.workTypes?.[0] === 'MUSIC' && (
                  <FaMusic className="text-6xl text-gray-500" title="Musik"/>
                )}
                {workData.workTypes?.[0] === 'GAME' && (
                  <FaGamepad className="text-6xl text-gray-500"  title="Spil"/>
                )}
                {workData.workTypes?.[0] === 'ARTICLE' && (
                  <FaFileAlt className="text-6xl text-gray-500"  title="Artikler"/>
                )}
                {!['LITERATURE', 'MOVIE', 'MUSIC', 'GAME', 'ARTICLE'].includes(workData.workTypes?.[0]) && (
                  <FaFileAlt className="text-6xl text-gray-500" /> // Default icon
                )}
              </div>    
            )}
          </div>
          <div className="md:w-2/3 md:pl-6">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-lg mb-2">Forfatter: {creator}</p>
            <p className="text-lg mb-2">Udgivelsesår: {year}</p>
            <p className="text-lg mb-2">Fiktion/Ikke-fiktion: {fictionNonfiction}</p>
            <p className="text-lg mb-2">Seneste udgivelsesdato: {latestPublicationDate}</p>
            <p className="text-lg mb-2">DK5 Klassifikation: {dk5Classification}</p>
            <p className="text-lg mb-2">Materialetyper: {materialTypes}</p>
            <p className="text-lg mb-2">Genre/Form: {genreAndForm}</p>
            <p className="text-lg mb-2">Emner: {subjects}</p>
            <p className="text-lg mb-2">Sprog: {languages}</p>
            <p className="text-lg mb-2">Værktype: {workTypes}</p>
            <p className="text-lg mb-2">Beskrivelse: {abstract}</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="inline-block bg-teal-500 text-white font-bold py-2 px-4 rounded hover:bg-teal-600 transition-colors duration-300 ease-in-out"
          >
            Tilbage til søgeresultat
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default WorkDetail;