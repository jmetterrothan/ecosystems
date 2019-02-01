import React from 'react';
import Slider from 'react-slick';
import classNames from 'classnames';

import './tutorial.styles';
import Row from '@public/components/row/row';
import Col from '@public/components/col/col';

type IHProps = {
  children: any;
  className?: string;
};

const H1: React.SFC<IHProps> = ({ children, className }) => (<h1 className={classNames('title', className)}>{children}</h1>);
const H2: React.SFC<IHProps> = ({ children, className }) => (<h2 className={classNames('title', className)}>{children}</h2>);
const H3: React.SFC<IHProps> = ({ children, className }) => (<h3 className={classNames('title', className)}>{children}</h3>);
const H4: React.SFC<IHProps> = ({ children, className }) => (<h4 className={classNames('title', className)}>{children}</h4>);
const H5: React.SFC<IHProps> = ({ children, className }) => (<h5 className={classNames('title', className)}>{children}</h5>);

type IArticle = {
  children: any;
  className?: string;
};

const Article: React.SFC<IArticle> = ({ children, className }) => (<article className={classNames('article', className)}>{children}</article>);

type ITutorialKey = {
  name: string;
  text: string;
};

const TutorialKey: React.SFC<ITutorialKey> = ({ name, text }) => (
  <div className='tutorial-key'>
    <span className='tutorial-key__name'>{name}</span>
    <p className='tutorial-key__text ml-2'>{text}</p>
  </div>
);

class Tutorial extends React.Component {
  render() {
    return (
      <div className='tab tab--tutorial'>
        <H3 className='mb-3'>Tutoriel</H3>
        <Article>
          <H4 className='mb-2'>Le projet</H4>
          <p className='mb-2'>
            Ecosystems est un projet réalisé par des étudiants <a className='link' href='https://www.ingenieur-imac.fr' target='_blank'>IMAC</a> dans le cadre du cours d'Intelligence Artificielle de 3ème année. Le but est de proposer une expérience web interactive dans un monde en 3d.
          </p>
          <p className='mb-3'>
            Le projet utilise three.js pour le rendu, React pour l'interface, et tensorflow pour pouvoir interagir en parlant avec le monde.
            Certaines fonctionnalités sont toujours en phase de développement notamment au niveau de l'interface et certains éléments de gameplay.
          </p>

          <H4 className='mb-2'>Commandes</H4>
          <H5 className='mt-2 mb-2 align-left'>Divers</H5>
          <Row>
            <Col className='flexcol--12-t mb-2 mb-0-t'>
              <ul className='tutorial-keys'>
                <li className='mb-1'>
                  <TutorialKey name='F5' text='Générer un nouveau monde' />
                </li>
                <li className='mb-1'>
                  <TutorialKey name='M' text='Activer/Désactiver le son' />
                </li>
                <li className='mb-1'>
                  <TutorialKey name='V' text='Activer/Désactiver les commandes vocales' />
                </li>
              </ul>
            </Col>
            <Col className='flexcol--12-t mb-2 mb-0-t'>
              <ul className='tutorial-keys'>
                <li className='mb-1'>
                  <TutorialKey name='Clic droit' text='Interagir' />
                </li>
                <li className='mb-1'>
                  <TutorialKey name='Echap' text='Retour au menu' />
                </li>
              </ul>
            </Col>
          </Row>
          <H5 className='mt-2 mb-2 align-left'>Mouvements</H5>
          <Row>
            <Col className='flexcol--12-t mb-2 mb-0-t'>
              <ul className='tutorial-keys'>
                <li className='mb-1'>
                  <TutorialKey name='Z' text='Avancer' />
                </li>
                <li className='mb-1'>
                  <TutorialKey name='S' text='Reculer' />
                </li>
                <li className='mb-1'>
                  <TutorialKey name='Q' text='Aller à gauche' />
                </li>
              </ul>
            </Col>
            <Col className='flexcol--12-t'>
              <ul className='tutorial-keys'>
                <li className='mb-1'>
                  <TutorialKey name='D' text='Aller à droite' />
                </li>
                <li className='mb-1'>
                  <TutorialKey name='A' text='Descendre' />
                </li>
                <li className='mb-1'>
                  <TutorialKey name='E' text='Monter' />
                </li>
              </ul>
            </Col>
          </Row>
        </Article>
        {/* <Slider dots={true} infinite={false} speed={500} slidesToShow={1} slidesToScroll={1}>
          <div>Page 1</div>
          <div>Page 2</div>
          <div>Page 3</div>
          <div>Page 4</div>
        </Slider> */}
      </div>
    );
  }

}

export default Tutorial;
